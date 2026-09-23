import type { Request, Response } from "express";
import Competition from "../models/Competition.model.js";
import Candidate from "../models/Candidate.model.js";
import User from "../models/User.model.js";

interface RegisterCandidateBody {
    phoneNumber: string;
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    city: string;
    state: string;
    country: string;
}

export const getCompetitions = async (req: Request, res: Response) => {


    const LIMIT = Number(req.query.limit) || 10;
    const SKIP = Number(req.query.skip) || 0;


    try {

        const competitionList = await Competition
            .find({})
            .select(
                "_id competitionName competitionType prizePool entryFee totalSlots bookedSlots registrationDeadline"
            )
            .limit(LIMIT)
            .skip(SKIP);

        const noOfCompetitions = await Competition.countDocuments();

        res.status(200).json({
            competitions: competitionList,
            nextSkip: LIMIT + SKIP,
            noMore: noOfCompetitions <= LIMIT + SKIP
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCompetition = async (
    req: Request,
    res: Response
) => {
    const { email } = req.query;
    const competitionId = req.params.competitionId as string;

    if (!email) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (!competitionId) {
        return res.status(400).json({
            message: "Competition id is required",
        });
    }

    try {
        // Decode the email
        const decodedEmail = decodeURIComponent(
            email as string
        )
            .trim()
            .toLowerCase();

        // Find the competition
        const competitionDetails =
            await Competition.findById(competitionId);

        if (!competitionDetails) {
            return res.status(404).json({
                message: "Competition not found",
            });
        }

        // Find the user using email
        const user = await User.findOne({
            email: decodedEmail,
        }).select("_id");

        let isRegistered = false;

        if (user) {
            // Check whether this user is registered
            // for this particular competition
            const candidate = await Candidate.findOne({
                userId: user._id,
                competitionId: competitionId,
            }).select("_id");

            isRegistered = !!candidate;
        }

        return res.status(200).json({
            competitionDetails,
            isRegistered,
        });
    } catch (error) {
        console.error("Get competition error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const registerForCompetition = async (
    req: Request<
        { competitionId: string },
        {},
        RegisterCandidateBody
    >,
    res: Response
) => {
    try {
        // Email comes from the query
        const emailQuery = req.query?.email as string;

        if (!emailQuery) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const email = decodeURIComponent(emailQuery)
            .trim()
            .toLowerCase();

        // Competition ID comes from URL params
        const { competitionId } = req.params;

        if (!competitionId) {
            return res.status(400).json({
                message: "Competition Id is required",
            });
        }

        // Candidate information comes from req.body
        const {
            phoneNumber,
            userId,
            firstName,
            lastName,
            dateOfBirth,
            city,
            state,
            country,
        } = req.body;

        // Validate candidate fields
        if (
            !phoneNumber ||
            !userId ||
            !firstName ||
            !lastName ||
            !dateOfBirth ||
            !city ||
            !state ||
            !country
        ) {
            return res.status(400).json({
                message: "All candidate fields are required",
            });
        }

        // Check competition
        const competition = await Competition.findById(
            competitionId
        );

        if (!competition) {
            console.log(competition);
            return res.status(404).json({
                message: "Competition not found",
            });
        }

        // Check available slots
        if (competition.bookedSlots >= competition.totalSlots) {
            return res.status(409).json({
                message: "Competition is full",
            });
        }

        // Check if user is already registered
        const existingCandidate = await Candidate.findOne({
            userId,
            competitionId,
        });

        if (existingCandidate) {
            return res.status(409).json({
                message:
                    "You are already registered for this competition",
            });
        }

        // Create candidate
        const candidate = await Candidate.create({
            email,
            phoneNumber,
            userId,
            firstName,
            lastName,
            dateOfBirth,
            city,
            state,
            country,
            competitionId,
        });

        // Increase booked slots
        competition.bookedSlots += 1;

        await competition.save();

        return res.status(201).json({
            message:
                "Successfully registered for the competition",

            candidate,

            competition: {
                id: competition._id,
                totalSlots: competition.totalSlots,
                bookedSlots: competition.bookedSlots,
                availableSlots:
                    competition.totalSlots -
                    competition.bookedSlots,
            },
        });
    } catch (error) {
        console.error(
            "Register competition error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong while registering for the competition",
        });
    }
};


export const withdrawApplication = async (req: Request, res: Response) => {
    const { email } = req.query;
    const { competitionId } = req.params;

    if (!email) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (!competitionId) {
        return res.status(400).json({
            message: "Competition id is required",
        });
    }

    try {

        const decodedEmail = decodeURIComponent(email as string);

        const user = await User.findOne({ email: decodedEmail }).select("_id").lean();

        if(!user || !user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Find the candidate registered for this competition
        const candidate = await Candidate.findOne({
            userId: user._id,
            competitionId,
        });

        if (!candidate) {
            return res.status(404).json({
                message: "You are not registered for this competition",
            });
        }

        // Delete the candidate
        await Candidate.findByIdAndDelete(candidate._id);

        // Free one slot
        const competition = await Competition.findByIdAndUpdate(
            competitionId,
            {
                $inc: {
                    bookedSlots: -1,
                },
            },
            { new: true }
        );

        if (!competition) {
            return res.status(404).json({
                message: "Competition not found",
            });
        }

        return res.status(200).json({
            message: "Application withdrawn successfully",
            bookedSlots: competition.bookedSlots,
            remainingSlots:
                competition.totalSlots - competition.bookedSlots,
        });
    } catch (error) {
        console.error("Withdraw application error:", error);

        return res.status(500).json({
            message: "Failed to withdraw application",
        });
    }
};
