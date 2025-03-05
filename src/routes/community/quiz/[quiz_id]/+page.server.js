export const load = async ({params,locals: {supabase}}) => {
    const {data: quiz, error} = await supabase.from("Quiz").select("id,title,due,created_at,Member(username,name,surname),quiz_questions(*)").eq("id",params.quiz_id);
    let alreadyCompleted = false;
    const {data: {user}} = await supabase.auth.getUser();
    if(quiz && user){
        const {data: attempt} = await supabase.from("quiz_attempt").select("*").eq("quiz_id",params.quiz_id).eq("user_id",user.id);
        if(attempt.length > 0){
            alreadyCompleted = true;
        }
        return {quiz: quiz[0], alreadyCompleted};
    }

    else{
        if(!user){
            return {error: "User not authenticated"};
        }
        if(!quiz){
            return {error: "Quiz not found"}
        }
    }

}