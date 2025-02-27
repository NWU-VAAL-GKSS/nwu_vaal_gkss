
export const load = async({locals: {supabase}}) =>{
    const {data, error} = await supabase.from("Events")
                        .select('*,event_attendee(*,Member(username))').order('created_at', { ascending: false });                       
    if(!data){
        console.error("error")
        console.error(error)
    }
    else{
        return {events: data};
    }

}