import { validate, errors } from 'com';
import retrieveCharacter from './retrieveCharacter';

const { SystemError } = errors;

function getDivision(winStreak: number): string {
    const divisions = {
        bronze: { min: 1, max: 500 },
        silver: { min: 501, max: 799 },
        gold: { min: 800, max: 999 },
        platinum: { min: 1000, max: 1499 },
        emerald: { min: 1500, max: 1999 },
        diamond: { min: 2000, max: 2499 },
        master: { min: 2500, max: 2999 },
        grandmaster: { min: 3000, max: 3499 },
        challenger: { min: 3500, max: Infinity },
    };

    for (const [division, range] of Object.entries(divisions)) {
        if (winStreak >= range.min && winStreak <= range.max) {
            return division;
        }
    }
    return 'iron';
}


async function getEloFromCharacter(userId: string): Promise<string[]> {
    validate.text(userId, 'userId', true);

    try {
        const characters = await retrieveCharacter(userId);
        const elos = characters.map(char => getDivision(char.win_streak));
        return elos;
    } catch (error) {
        console.error('Failed to retrieve characters:', error);
        throw new SystemError('Failed to retrieve characters');
    }
}

export default getEloFromCharacter;
