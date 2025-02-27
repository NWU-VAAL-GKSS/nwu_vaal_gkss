import { json } from '@sveltejs/kit';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	addEvent: async ({locals: {supabase}, request}) => {
		// TODO log the user in
        const data = await request.formData();
        let external_link = null;
        if(data.get("is_external")){
            external_link = data.get("external_link");
        }
        const { error } = await supabase
        .from('Events')
        .insert({  topic: data.get('topic'),
            description: data.get('description'),
            date: data.get('date'),
            venue: data.get("venue"),
            public: data.get("public"),
            external: data.get("is_external"),
            external_link: external_link,
            needs_groups: data.get("needs_groups"),
         })

         if(error){
            console.log(error);
         }

	},
    deleteEvent: async ({locals: {supabase},request}) => {
        //delete event based on id
        const data = await request.formData();
        const id = data.get("id");
        const {error} = await supabase.from("Events").delete().eq("id",id);
        if(!error){
            return json({
            success: true,
            message: "Form submitted successfully!",
        })
        }
    },
    
    
};