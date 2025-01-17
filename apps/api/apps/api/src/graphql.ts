
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface AVS {
    id: string;
    owner: string;
    operatorCount: number;
    operatorSetCount: number;
    slashingCount: number;
    strategyCount: number;
    stakerCount: number;
    metadataURI: string;
    lastUpdateBlockNumber: string;
    lastUpdateBlockTimestamp: string;
}

export interface IQuery {
    getAVSData(skip: number, first: number, orderBy: string, orderDirection: string): AVS[] | Promise<AVS[]>;
}

type Nullable<T> = T | null;
