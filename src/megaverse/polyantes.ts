import axios from 'axios';
import { MegaverseInterface } from './megaverse.interface';

export class PolyanetStrategy implements MegaverseInterface {
  async add(column: number, row: number): Promise<any> {
    try {
      const data = JSON.stringify({
        row,
        column,
        candidateId: process.env.CANDIDATE_ID,
      });
      const response = await axios.post(
        `${process.env.API_URL}polyanets`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error adding cometh:', error);
      throw error;
    }
  }
}
