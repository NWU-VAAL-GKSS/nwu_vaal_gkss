import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const {quiz} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    //insert quiz
    const {data: dbQuiz ,error} = await supabase.from("Quiz").insert({
        title: quiz.title,
        creator_id: user.id,
        due: quiz.due
    }).select();
    if(!error){
        //insert questions
        quiz.questions.forEach(async (question) => {
            const {data: res, error} = await supabase.from("quiz_questions").insert({
                quiz_id: dbQuiz[0].id,
                type: question.type,
                text: question.text,
                options: question.options,
                correctOption: question.correctOption,
                correctAnswer: question.correctAnswer,
                points: question.points,
            }).select();  
        });
        return json({success: true})
    }else{
        console.log(error);
        return json({success: false,error});
    }
}