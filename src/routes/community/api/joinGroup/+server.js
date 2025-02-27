import { json } from '@sveltejs/kit';

export const POST = async ({locals:{supabase},request}) => {
    const {group_id} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    const {data,error} = await supabase.from("event_group_member").insert({
        user_id: user.id,
        event_group_id: group_id,
    })

    if(error){
        return json({success: false,error})
    }
    else{
        return json({success: true});
    }
}