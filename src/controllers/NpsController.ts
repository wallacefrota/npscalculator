import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    /**
     * 1 2 3 4 5 6 7 8 9 10
     * Detratores => 0 - 6
     * Passivos => 7 - 8
     * Promotores => 9
     * 
     * (Número de promotores - número de detratores) /  (número de respondentes) * 100
     */

    async execute(request: Request, response: Response) {
        const {survey_id} = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

        // obtendo todas as respostas
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        // filtrando respostas
        const detractors = surveysUsers.filter(survey => survey.value >= 6 && survey.value <= 6).length;
        const promoters = surveysUsers.filter(survey => survey.value >= 9).length;

        // total de respostas;
        const totalAnswers = surveysUsers.length;
        // calculando
        const calculate = Number(
            (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractors,
            promoters,
            totalAnswers,
            nps: calculate
        })
    }
}

export {NpsController}