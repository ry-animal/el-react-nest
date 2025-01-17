import { Test, TestingModule } from '@nestjs/testing';
import { SubgraphResolver } from '../subgraph.resolver';
import { SubgraphService } from '../subgraph.service';

describe('SubgraphResolver', () => {
    let resolver: SubgraphResolver;
    let service: SubgraphService;

    const mockAVSData = [
        {
            __typename: "AVS",
            id: "0x2006a6d06260827621b54bb9c0e6c97a875f4436",
            owner: "0x2006a6d06260827621b54bb9c0e6c97a875f4436",
            operatorCount: 3,
            operatorSetCount: 1,
            strategyCount: 12,
            stakerCount: 3,
            slashingCount: 0,
            lastUpdateBlockNumber: "3162360",
            lastUpdateBlockTimestamp: "1737101064",
            metadataURI: ""
        }
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubgraphResolver,
                {
                    provide: SubgraphService,
                    useValue: {
                        getAVSData: jest.fn().mockResolvedValue(mockAVSData)
                    }
                }
            ],
        }).compile();

        resolver = module.get<SubgraphResolver>(SubgraphResolver);
        service = module.get<SubgraphService>(SubgraphService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should get AVS data', async () => {
        const skip = 0;
        const first = 10;
        const orderBy = 'operatorCount';
        const orderDirection = 'desc';

        const result = await resolver.getAVSData(skip, first, orderBy, orderDirection);
        expect(service.getAVSData).toHaveBeenCalledWith(skip, first, orderBy, orderDirection);
        expect(result).toEqual(mockAVSData);
    });
}); 