import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ComethStrategy } from 'src/megaverse/cometh';
import { MegaverseInterface } from 'src/megaverse/megaverse.interface';
import { PolyanetStrategy } from 'src/megaverse/polyantes';
import { SoolonsStrategy } from 'src/megaverse/soloons';
import * as fs from 'fs';

@Injectable()
export class ChallangeService {
  private strategy: MegaverseInterface;

  public async createCross() {
    const margin = 2;
    const sizeArray = 11;

    try {
      const promises = this.getPositions(sizeArray, margin).map(
        async (position) => {
          this.strategy = new PolyanetStrategy();
          return this.delayedAdd(position[0], position[1]);
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
      col < margin || //left
      row < margin || //top
      col > sizeArray - margin - 1 || //right
      row > sizeArray - margin - 1 //bottom
      //note: -1 is bc sizeArray is eleven but the col|rows are 0 to 10
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

  public async createLogo() {
    const jsonString = fs.readFileSync(
      './src/challange/json/map.logo.json',
      'utf-8',
    );
    const gameMatrix = JSON.parse(jsonString);
    const matrix = gameMatrix.goal;
    for (let row = 0; row < matrix.length; row++) {
      for (let column = 0; column < matrix[row].length; column++) {
        const cellValue = matrix[row][column];

        if (cellValue.endsWith('_SOLOON')) {
          this.strategy = new SoolonsStrategy();
          const color: string = cellValue.split('_')[0];
          await this.delayedAdd(column, row, color.toLowerCase());
        }
        if (cellValue.endsWith('_COMETH')) {
          this.strategy = new ComethStrategy();
          const position: string = cellValue.split('_')[0];
          await this.delayedAdd(column, row, position.toLowerCase());
        }
        if (cellValue == 'POLYANET') {
          this.strategy = new PolyanetStrategy();
          await this.delayedAdd(column, row);
        }
      }
    }
  }
  async delayedAdd(column: number, row: number, ...args: any[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.strategy.add(column, row, ...args);
  }
}
