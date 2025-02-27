export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    let currentUser = null;
    const {data: Member} = await supabase.from("Member").select('image,date_of_birth,name,surname,username,year_of_study,qualification, points');
    const members = [];
    for(let member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")));//removing the first "file/"
        member = {...member,image: publicUrl.data.publicUrl};
        members.push(member);
    }
    
    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('*')   
        if(Team){
            let isMember = false;
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isMember = true;   
                    currentUser = member;                 
                }
            });
            if(!isMember){
                //return the current user
                currentUser = members.filter(member => member.id == user.id)
            }

            if(currentUser && currentUser.image){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(currentUser.image.substring(currentUser.image.indexOf("/")));//removing the first "file/"
                currentUser = {...currentUser,image: publicUrl.data.publicUrl}
            }
            return {isLoggedIn: true, isExecutive: isMember, currentUser, members};
        }
    }
    else{
        return {isLoggedIn: false, members};
    }
}