import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const {quiz_id} = await request.json();
    const {data,error} = await supabase.from("Quiz").delete().eq("id",quiz_id);

    if(!error){
        return json({sucess: true})
    }
    return json({sucess: false,error})
}