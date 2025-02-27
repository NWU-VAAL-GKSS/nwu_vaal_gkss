export const load = async ({locals: {supabase},params}) => {
    const {data: group, error} = await supabase.from("event_group").select("*,event_group_member(id,Member(username,name,surname)),Member(username,name,surname)").eq("id",params.group_id);
    if(error){
        console.log(error);
    }
    else{
        return {group: group};
    }
}