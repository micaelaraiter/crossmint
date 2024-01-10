import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChallangeService {
  public async createCross() {
    const margin = 2;
    const sizeArray = 11;

    try {
      const promises = this.getPositions(sizeArray, margin).map(
        async (position) => {
          const data = JSON.stringify({
            row: position[1],
            column: position[0],
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
        },
      );

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error al realizar las solicitudes:', error);
      throw error;
    }
  }

  private isMargin(margin, sizeArray, col, row) {
    return (
      col < margin ||
      row < margin ||
      col > sizeArray - margin - 1 ||
      row > sizeArray - margin - 1
    );
  }

  private getPositions(sizeArray, margin) {
    const invertedDiagonal = [];
    const diagonal = [];
    for (let i = 0; i < sizeArray; i++) {
      for (let j = 0; j < sizeArray; j++) {
        if (
          !this.isMargin(margin, sizeArray, i, j) &&
          i + j === sizeArray - 1
        ) {
          invertedDiagonal.push([i, j]);
        }
        if (!this.isMargin(margin, sizeArray, i, j) && i == j) {
          diagonal.push([i, j]);
        }
      }
    }
    return invertedDiagonal.concat(diagonal);
  }
}
