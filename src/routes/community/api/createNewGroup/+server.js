import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const {groupForm} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    const {data: group,error} = await supabase.from("event_group").insert({
        name: groupForm.name,
        event_id: groupForm.event_id,
        is_public: groupForm.is_public,
        user_id: user.id,
    }).select("*,event_group_member(id,Member(username,name,surname)),Member(username,name,surname)");

    if(!error){
        return json({success: true,group})
    }else{
        return json({success: false})
    }
}