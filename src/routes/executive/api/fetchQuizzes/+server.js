import { json } from '@sveltejs/kit';

export const GET = async ({locals: {supabase}}) => {
    const {data: quizzes, error} = await supabase.from("Quiz").select("id,title,created_at,due,Member(username,name,surname),quiz_questions(*)");
    if(error){
        return json({success: false, error})
    }
    return json({success: true,quizzes})
}