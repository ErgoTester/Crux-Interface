import { IFilters, IQueries, ISorting, ITimeframe, ITokenData } from '@src/pages/tokens';
import { NextApiRequest, NextApiResponse } from 'next';
import { tokenData } from './data/tokenInfo';

type CombinedType = IFilters & ISorting & IQueries & ITimeframe;

function applyFiltersAndSort(tokens: ITokenData[], filters: CombinedType): ITokenData[] {
  let filteredTokens = tokens;

  // Apply filters
  filteredTokens = filteredTokens.filter(token => {
    if (filters.priceMin !== undefined && token.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && token.price > filters.priceMax) return false;
    if (filters.liquidityMin !== undefined && token.liquidity < filters.liquidityMin) return false;
    if (filters.liquidityMax !== undefined && token.liquidity > filters.liquidityMax) return false;
    if (filters.mktCapMin !== undefined && token.mktCap < filters.mktCapMin) return false;
    if (filters.mktCapMax !== undefined && token.mktCap > filters.mktCapMax) return false;
    if (filters.pctChangeMin !== undefined && token.pctChange1hr < filters.pctChangeMin) return false;
    if (filters.pctChangeMax !== undefined && token.pctChange1hr > filters.pctChangeMax) return false;
    if (filters.volMin !== undefined && token.vol < filters.volMin) return false;
    if (filters.volMax !== undefined && token.vol > filters.volMax) return false;
    if (filters.buysMin !== undefined && token.buys < filters.buysMin) return false;
    if (filters.buysMax !== undefined && token.buys > filters.buysMax) return false;
    if (filters.sellsMin !== undefined && token.sells < filters.sellsMin) return false;
    if (filters.sellsMax !== undefined && token.sells > filters.sellsMax) return false;

    return true;
  });

  if (filters.sortBy) {
    filteredTokens = filteredTokens.sort((a, b) => {
      let sortValueA;
      let sortValueB;

      switch (filters.sortBy) {
        case 'price':
          sortValueA = a.price;
          sortValueB = b.price;
          break;
        case 'liquidity':
          sortValueA = a.liquidity;
          sortValueB = b.liquidity;
          break;
        case 'mktCap':
          sortValueA = a.mktCap;
          sortValueB = b.mktCap;
          break;
        case 'pctChange':
          sortValueA = a.pctChange1hr;
          sortValueB = b.pctChange1hr;
          break;
        case 'vol':
          sortValueA = a.vol;
          sortValueB = b.vol;
          break;
        case 'buys':
          sortValueA = a.buys;
          sortValueB = b.buys;
          break;
        case 'sells':
          sortValueA = a.sells;
          sortValueB = b.sells;
          break;
        case 'high':
          sortValueA = a[`pctChange${filters.selectedPeriod ? filters.selectedPeriod : '24hr'}`];
          sortValueB = b[`pctChange${filters.selectedPeriod ? filters.selectedPeriod : '24hr'}`];
          break;
        case 'low':
          sortValueA = -a[`pctChange${filters.selectedPeriod ? filters.selectedPeriod : '24hr'}`];
          sortValueB = -b[`pctChange${filters.selectedPeriod ? filters.selectedPeriod : '24hr'}`];
          break;
        case 'totalTransactions':
          sortValueA = a.buys + a.sells;
          sortValueB = b.buys + b.sells;
          break;
        // ... add more sorting options ...
        default:
          sortValueA = 0;
          sortValueB = 0;
      }

      return filters.sortOrder === 'DEC' ? sortValueB - sortValueA : sortValueA - sortValueB;
    });
  }

  return filteredTokens;
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filters: CombinedType = req.query;
    const limit = filters.limit || 25;
    const offset = filters.offset || 0;

    let filteredTokens = applyFiltersAndSort(tokenData, filters);
    filteredTokens = filteredTokens.slice(offset, offset + limit); // Apply pagination

    res.status(200).json(filteredTokens);
  } else {
    res.status(405).end();
  }
}