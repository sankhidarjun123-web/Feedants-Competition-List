import { Router } from "express";
import { getCompetitions, getCompetition, registerForCompetition, withdrawApplication } from "../controllers/competition.controller.js";


const router = Router();


router.get("/list", getCompetitions);

router.get("/details/:competitionId", getCompetition);

router.post("/candidate/register/:competitionId", registerForCompetition);

router.delete("/candidate/withdraw/:competitionId", withdrawApplication);

export default router;