import { Test, TestingModule } from '@nestjs/testing';
import { SubgraphService } from '../subgraph.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('SubgraphService', () => {
    let service: SubgraphService;
    let mockHttpService: { post: jest.Mock };

    const mockAVSData = [
        {
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
        mockHttpService = {
            post: jest.fn()
        };

        mockHttpService.post.mockReturnValue(of({
            data: {
                data: {
                    avses: mockAVSData
                }
            }
        }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubgraphService,
                {
                    provide: HttpService,
                    useValue: mockHttpService
                }
            ],
        }).compile();

        service = module.get<SubgraphService>(SubgraphService);
    });

    it('should fetch AVS data with correct parameters', async () => {
        const result = await service.getAVSData(0, 10, 'operatorCount', 'desc');

        expect(mockHttpService.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                variables: {
                    skip: 0,
                    first: 10,
                    orderBy: 'operatorCount',
                    orderDirection: 'desc'
                }
            })
        );

        expect(result).toEqual(mockAVSData);
    });

    it('should handle empty response', async () => {
        mockHttpService.post.mockReturnValueOnce(of({
            data: {
                data: {
                    avses: []
                }
            }
        }));

        const result = await service.getAVSData(0, 10, 'lastUpdateBlockTimestamp', 'desc');
        expect(result).toEqual([]);
    });
}); 