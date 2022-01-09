import { Injectable } from '@nestjs/common';

interface QueryForMultipleRow {
  tableName: string;
  columnData: Array<{ [s: string]: any }>;
  keysToIgnore: string[];
  keysToReplace?: Record<string, any>;
  whereCondition?: string;
  addSqlQuery?: Record<string, any>;
  start?: number;
}

interface UpdateQueryForMultipleRow {
  tableName: string;
  columnData: { [s: string]: any };
  keysToIgnore: string[];
  keysToReplace?: Record<string, any>;
  whereCondition?: string;
  addSqlQuery?: Record<string, any>;
  start?: number;
}

@Injectable()
export class UtilsService {
  static generateQueryForMultipleRowInsert({
    tableName,
    columnData,
    keysToIgnore,
    keysToReplace = [],
  }: QueryForMultipleRow) {
    // Replace the dynamic values here
    columnData = columnData.map((singleData) => {
      keysToReplace.forEach((singleKeyToReplace) => {
        singleData[Object.keys(singleKeyToReplace)[0]] =
          singleKeyToReplace[Object.keys(singleKeyToReplace)[0]];
      });
      return singleData;
    });
    const columnNamesSnakeCase = Object.keys(columnData[0])
      .filter((x) => !keysToIgnore.includes(x))
      .map(this.camelToSnakeCase);
    const columnNames = columnNamesSnakeCase.join(', ');

    const columnValues = columnData.map((singleColumn) => {
      keysToIgnore.forEach((x) => delete singleColumn[x]);

      const string = Object.values(singleColumn).reduce((prev, curr, index) => {
        if (index === 1 && typeof prev === 'string') {
          prev = `'${prev}'`;
        }
        if (typeof curr === 'string') {
          curr = `'${curr}'`;
        }
        return (prev ? prev : prev) + ', ' + curr;
      });
      return `(${string})`;
    });
    return `INSERT INTO ${tableName} (${columnNames})
    VALUES
    ${columnValues};`;
  }

  static camelToSnakeCase(str) {
    return str.replace(/[A-Z0-9]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static convertSnakeCaseToCamelCase(stringToBeConverted: string) {
    return stringToBeConverted.replace(/(_\w)/g, (k) => {
      return k[1].toUpperCase();
    });
  }

  static convertStringToSentenceCase(stringToBeConverted: string) {
    return stringToBeConverted.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  static generatePreparedInsertQuery({
    tableName,
    columnData,
    keysToIgnore,
    keysToReplace = {},
    addSqlQuery = {},
    start = 1,
  }: QueryForMultipleRow) {
    // Replace the dynamic values here
    columnData = columnData.map((singleData) => {
      for (const singleKeyToReplace in keysToReplace) {
        singleData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
      }
      return singleData;
    });
    const columnKeyNames = Object.keys(columnData[0]);

    const columnNamesSnakeCase = columnKeyNames
      .filter((x) => !keysToIgnore.includes(x))
      .map(this.camelToSnakeCase);
    const param = [],
      value = [];

    for (const key in addSqlQuery) {
      columnNamesSnakeCase.push(key);
    }

    for (const singleRow of columnData) {
      const { preparedParam, preparedValue } = this.getPreparedParams(
        singleRow,
        keysToIgnore,
        start,
        columnKeyNames,
      );
      for (const key in addSqlQuery) {
        preparedParam.push(addSqlQuery[key]);
      }
      param.push(preparedParam);
      value.push(...preparedValue);
      start += preparedValue.length;
    }
    const columnNames = columnNamesSnakeCase.join(', ');
    return {
      query: `INSERT INTO ${tableName} (${columnNames})
              VALUES ${param.map((x) => `(${x.join(', ')})`)}`,
      data: value,
    };
  }

  static generatePreparedUpdateQuery({
    tableName,
    columnData,
    keysToIgnore,
    keysToReplace = {},
    addSqlQuery = {},
    whereCondition,
    start = 1,
  }: UpdateQueryForMultipleRow) {
    // Replace the dynamic values here
    for (const singleKeyToReplace in keysToReplace) {
      columnData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
    }

    const { preparedParam, preparedValue } = this.alterPreparedParams(
      columnData,
      keysToIgnore,
      start,
    );

    for (const key in addSqlQuery) {
      preparedParam.push(`${key} = ${addSqlQuery[key]}`);
    }

    return {
      query: `UPDATE ${tableName}
              SET ${preparedParam.join(', ')}
              WHERE ${whereCondition}`,
      data: preparedValue,
    };
  }

  static getPreparedParams(
    columnData,
    keysToIgnore,
    start = 1,
    columnKeyNames: string[],
  ) {
    const preparedValue = [];
    const preparedParam = [];

    for (const key of columnKeyNames) {
      if (!keysToIgnore.includes(key)) {
        columnData[key] = columnData[key] === '' ? null : columnData[key];
        preparedParam.push(`$${start}`);
        preparedValue.push(columnData[key] ?? null);
        start++;
      }
    }

    return {
      preparedParam,
      preparedValue,
    };
  }

  static alterPreparedParams(columnData, keysToIgnore, start = 1) {
    const preparedValue = [];

    const preparedParam = [];

    for (const key in columnData) {
      if (!keysToIgnore.includes(key)) {
        columnData[key] = columnData[key] === '' ? null : columnData[key];
        preparedParam.push(`${this.camelToSnakeCase(key)} = $${start}`);
        preparedValue.push(columnData[key]);
        start++;
      }
    }

    return {
      preparedParam,
      preparedValue,
    };
  }
}
