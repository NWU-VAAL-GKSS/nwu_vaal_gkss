import { error, redirect } from '@sveltejs/kit';
export async function load({params, locals: {supabase}}) {

    let username = params.username;
    let email = null;
    let isMyProfile = false;//checking if the user is viewing their own profile
    const {data: {user}} = await supabase.auth.getUser();//gets the currently logged in user, we need the id
    if(params.username == "profile" && user != null)//this is the current session user's profile
    {
        const {data, error} = await supabase.from("Member").select().eq("id",user.id);//we use the id to get the username of the user
        username = data[0].username;//set the username to the username of the logged in user
    }
    

    const {data} = await supabase.from("Member").select("*").eq("username",username);//query a member with the given username

    if(data){
        //the query returns an array, with length of 1.
        if(data.length > 0){
            //fetch all topics by this member
            //did this offline, check it when online...
            const {data: Topic, error} = await supabase.from("Topic").select("id,content,created_at,tags,topic, Member(username,image,name,surname),Comment(*),topic_views(*),topic_images(image)").eq("author_id",data[0].id).order('created_at', { ascending: false });
            let allTopics = [];
            let user_views = 0;
            for(let topic of Topic){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(topic.Member.image.substring(topic.Member.image.indexOf("/")+1));//removing the first "file/"
                user_views += topic.topic_views.length;
                topic = {...topic,Member: {image: publicUrl.data.publicUrl, username: topic.Member.username, fullName: topic.Member.name + " " + topic.Member.surname}};
                const finalImages = [];
                for(const file of topic.topic_images){
                    let publicUrl = await supabase.storage.from("files").getPublicUrl(file.image);
                    finalImages.push(publicUrl.data.publicUrl);
                }
                topic = {...topic, topic_images: finalImages};
                allTopics.push(topic);
            }
            
            const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").eq("user_id",data[0].id).order('created_at', { ascending: false });
            let projects = [];
            let user_rating = 0;
            for(const project of Project){
                const {data: Project_rating} = await supabase.from("Project_rating").select("rating,Member(id)").eq("project_id",project.id);
                let rating = Project_rating;
                
                for(const rate of rating){
                    user_rating += Number(rate.rating);
                }
                //project rating average
                user_rating = user_rating/rating.length;
                projects.push({...project,rating: rating})
            }
            user_rating = user_rating/projects.length;
            

            //return the object with the user's topics and details
            let publicUrl = await supabase.storage.from("files").getPublicUrl(data[0].image.substring(data[0].image.indexOf("/")+1));//removing the first "file/"
            let image = publicUrl.data.publicUrl;
            return {fullName: data[0].name + " " + data[0].surname,username,image,topics: allTopics, projects, user_rating, user_views, points: data[0].points};
        }
        else{
            //the query was negative, as the username does not exist in the database, we throw error
            return {notFound: true}
        }
    }
    
}

export const actions = {
    
}

