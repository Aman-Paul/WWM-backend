import { Test, TestingModule } from '@nestjs/testing';
import { Policies } from './policies';

describe('Policies', () => {
  let provider: Policies;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Policies],
    }).compile();

    provider = module.get<Policies>(Policies);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
