const flattenQuestions = (data: any, interviewType: string) => {
    if(!data) return [];

    let allQuestions: string[] = [];

    let sections = [
        data.Education,
        data.Work_Experience,
        data.Projects,
        data.Skills,
        data.Leadership,
    ];

    for (let section of sections) {
        if(!Array.isArray(section)) continue;

        for(let item of section) {
            if(interviewType === "Behavioral") {
                allQuestions.push(...(item.hr_questions || []));
            }
            else if(interviewType === "Engineering Manager") {
                allQuestions.push(...(item.technical_questions || []));
            }
            else {
                allQuestions.push(...(item.hr_questions || []));
                allQuestions.push(...(item.technical_questions || []));
            }
        }
    }

    return allQuestions;
}

export default flattenQuestions;