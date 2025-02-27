import { json } from '@sveltejs/kit'

export const POST = async ({locals: {supabase}, request}) => {
    const {event_id} = await request.json();
    const {data: groups, error} = await supabase.from("event_group").select("*,event_group_member(id,Member(username,name,surname)),Member(username,name,surname)").eq("event_id",event_id);

    if(error){
        return json({success: false,error});
    }else{
        return json({success: true,groups})

    }
}