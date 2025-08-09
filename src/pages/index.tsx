import { FC, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  CircularProgress,
  IconButton,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TokenSort from '@components/tokens/TokenSort';
import TokenFilterOptions from '@components/tokens/Filters';
import { formatNumber } from '@lib/utils/general';
import { useRouter } from 'next/router';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { currencies, Currencies } from '@lib/utils/currencies';
import { useInView } from "react-intersection-observer";
import BouncingDotsLoader from '@components/DotLoader';
import { checkLocalIcon, getIconUrlFromServer } from '@lib/utils/icons';
import SearchIcon from '@mui/icons-material/Search';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';

const Tokens: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<Currencies>('ERG');
  const [ergExchange, setErgExchange] = useState(1);
  const [filteredTokens, setFilteredTokens] = useState<ITokenData[]>([]);
  const [filters, setFilters] = useState<IFilters>({});
  const [sorting, setSorting] = useState<ISorting>({ sort_by: 'Liquidity', sort_order: 'Desc' });
  const [queries, setQueries] = useState<IQueries>({ limit: 25, offset: 0 });
  const [timeframe, setTimeframe] = useState<ITimeframe>({ filter_window: 'Day' });
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [noMore, setNoMore] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [view, inView] = useInView({ threshold: 0 });
  const [searchString, setSearchString] = useState('');
  const [triggerSearchFetch, setTriggerSearchFetch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleCurrencyChange = (e: any, value: 'ERG' | 'USD') => {
    if (value !== null) {
      setCurrency(value);
    }
  };

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: 'Hour' | 'Day' | 'Week' | 'Month',
  ) => {
    if (newTimeframe !== null && newTimeframe !== undefined) setTimeframe({ filter_window: newTimeframe });
  };

  async function fetchTokenData(
    filters: IFilters,
    sorting: ISorting,
    queries: IQueries,
    timeframe: ITimeframe,
    inputtedSearchString: string
  ) {
    setLoading(true);
    try {
      setError(undefined);

      const endpoint = `${process.env.CRUX_API}/spectrum/token_list`;
      const payload = {
        ...filters,
        ...sorting,
        ...queries,
        ...timeframe,
        "name_filter": inputtedSearchString
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data: IApiTokenData[] = await response.json();

      if (data.length === 0) setNoMore(true);
      else {
        setNoMore(false);
        const awaitedData = await Promise.all(data.map((item) => {
          return mapApiDataToTokenData(item);
        }));
        if (queries.offset === 0) {
          setFilteredTokens(awaitedData);
          setErgExchange(data[0].erg_price_usd);
        }
        else {
          setFilteredTokens(prev => [...prev, ...awaitedData]);
        }
        setQueries(prevQueries => ({
          ...prevQueries,
          offset: prevQueries.offset + 25
        }));
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
      setError('Error loading tokens');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setSearchLoading(false);
    }
  }

  const mapApiDataToTokenData = async ({
    name,
    ticker,
    id,
    volume,
    liquidity,
    buys,
    sells,
    market_cap,
    price_erg,
    erg_price_usd,
    ...item
  }: IApiTokenData): Promise<ITokenData> => {
    const hourChangeKey = currency === "ERG" ? "hour_change_erg" : "hour_change_usd";
    const dayChangeKey = currency === "ERG" ? "day_change_erg" : "day_change_usd";
    const weekChangeKey = currency === "ERG" ? "week_change_erg" : "week_change_usd";
    const monthChangeKey = currency === "ERG" ? "month_change_erg" : "month_change_usd";

    // Check for the icon locally first
    let url = await checkLocalIcon(id);

    // Otherwise, check the server for it
    if (!url) {
      url = await getIconUrlFromServer(id);
    }

    return {
      name,
      ticker,
      tokenId: id,
      icon: url || '',
      price: price_erg,
      pctChange1h: item[hourChangeKey],
      pctChange1d: item[dayChangeKey],
      pctChange1w: item[weekChangeKey],
      pctChange1m: item[monthChangeKey],
      vol: volume,
      liquidity,
      buys,
      sells,
      mktCap: market_cap,
    };
  };

  const fetchData = async (reset?: boolean) => {
    if (reset) {
      setQueries(prevQueries => ({ ...prevQueries, offset: 0 }));
      setFilteredTokens([]);
      await fetchTokenData(filters, sorting, { ...queries, offset: 0 }, timeframe, searchString);
    }
    else fetchTokenData(filters, sorting, queries, timeframe, searchString);
  };

  useEffect(() => {
    if (!initialLoading) {
      setInitialLoading(true);
      fetchData(true);
    }
  }, [filters, sorting, timeframe]);
  useEffect(() => {
    if (inView && !loading && !noMore) {
      fetchData();
    }
  }, [inView]);

  useEffect(() => {
    if (searchString.length === 0) {
      // If search string is empty, reset to fetch all tokens
      fetchData(true);
    }
  }, [searchString]);

  const handleSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchLoading(true);
      setQueries(prev => ({ ...prev, offset: 0 }));
      fetchTokenData(filters, sorting, { limit: 25, offset: 0 }, timeframe, searchString);
    }
  };

  const handleSearchSubmit = () => {
    setSearchLoading(true);
    setQueries(prev => ({ ...prev, offset: 0 }));
    fetchTokenData(filters, sorting, { limit: 25, offset: 0 }, timeframe, searchString);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <TextField
            id="search-field"
            variant="filled"
            value={searchString}
            onChange={handleSearchStringChange}
            onKeyDown={handleEnterKeyPress}
            fullWidth
            placeholder="Search"
            disabled={searchLoading}
            sx={{
              '& .Mui-disabled': {
                borderColor: theme.palette.text.disabled
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchSubmit} aria-label="search" edge="end" sx={{ borderRadius: 0 }}>
                  {searchLoading ? <YoutubeSearchedForIcon /> : <SearchIcon />}
                </IconButton>
              )
            }}
          />
        </Box>
        <Box sx={{ textAlign: 'right', display: upLg ? 'flex' : 'none' }}>
          <CurrencyToggleButton currency={currency} onCurrencyChange={handleCurrencyChange} />
        </Box>
      </Box>

      <TokenFilterOptions filters={filters} setFilters={setFilters} open={filterModalOpen} setOpen={setFilterModalOpen} />

      <Paper variant="outlined" sx={{ position: 'relative' }}>
        {upLg
          ? (
            <>
              <Box sx={{ py: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid xs={3}>
                    <Typography sx={{ ml: 2 }}>
                      Token
                    </Typography>
                  </Grid>
                  <Grid xs={2}>
                    Price
                  </Grid>
                  <Grid xs={1}>
                    H
                  </Grid>
                  <Grid xs={1}>
                    D
                  </Grid>
                  <Grid xs={1}>
                    W
                  </Grid>
                  <Grid xs={1}>
                    M
                  </Grid>
                  <Grid xs={1}>
                    <Typography>
                      Volume
                    </Typography>
                    <Typography>
                      Liquidity
                    </Typography>
                  </Grid>
                  <Grid xs={1}>
                    <Typography>
                      Transactions
                    </Typography>
                    <Typography>
                      Market Cap
                    </Typography>
                  </Grid>
                  <Grid xs={1}>
                    <Typography>
                      Buys
                    </Typography>
                    <Typography>
                      Sells
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{
                overflowX: 'hidden'
              }}>
                {loading && initialLoading
                  ? (
                    <Box sx={{ position: 'relative', minHeight: '300px' }}>
                      <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          <CircularProgress size={60} />
                        </Box>
                        <Typography>
                          Loading assets...
                        </Typography>
                      </Box>
                    </Box>
                  ) : error ? (
                    <Box sx={{ position: 'relative', minHeight: '300px' }}>
                      <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <Typography sx={{ mb: 2 }}>
                          {error}
                        </Typography>
                        <Button variant="outlined" onClick={() => window.location.reload()}>
                          Reload the page
                        </Button>
                      </Box>
                    </Box>
                  )
                    : (
                      <>
                        {filteredTokens.map((token, i) => (
                          <Box
                            key={`${token.tokenId}-${i}`}
                            sx={{
                              py: 1,
                              background: i % 2 ? '' : theme.palette.background.paper,
                              userSelect: 'none',
                              '&:hover': {
                                background: theme.palette.background.hover,
                                cursor: 'pointer'
                              }
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/tokens/${token.tokenId}`);
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid xs={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, ml: 1 }}>
                                  <Avatar src={token.icon} sx={{ width: '48px', height: '48px' }} />
                                  <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {token.name}
                                    </Typography>
                                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {token.ticker.toUpperCase()}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid xs={2}>
                                {currencies[currency] + formatNumber(currency === 'ERG' ? token.price : token.price * ergExchange, 4)}
                              </Grid>
                              <Grid xs={1}>
                                {formatPercent(token.pctChange1h * 100)}
                              </Grid>
                              <Grid xs={1}>
                                {formatPercent(token.pctChange1d * 100)}
                              </Grid>
                              <Grid xs={1}>
                                {formatPercent(token.pctChange1w * 100)}
                              </Grid>
                              <Grid xs={1}>
                                {formatPercent(token.pctChange1m * 100)}
                              </Grid>
                              <Grid xs={1}>
                                <Typography>
                                  V {currencies[currency] + formatNumber(currency === 'ERG' ? token.vol : token.vol * ergExchange, 2)}
                                </Typography>
                                <Typography>
                                  L {currencies[currency] + formatNumber(currency === 'ERG' ? token.liquidity : token.liquidity * ergExchange, 2)}
                                </Typography>
                              </Grid>
                              <Grid xs={1}>
                                <Typography>
                                  T {token.buys + token.sells}
                                </Typography>
                                <Typography>
                                  M {currencies[currency] + formatNumber(currency === 'ERG' ? token.mktCap : token.mktCap * ergExchange, 2)}
                                </Typography>
                              </Grid>
                              <Grid xs={1}>
                                <Typography sx={{ color: theme.palette.up.main }}>
                                  B {token.buys}
                                </Typography>
                                <Typography sx={{ color: theme.palette.down.main }}>
                                  S {token.sells}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Box ref={view} sx={{ minHeight: '24px' }}>
                          {noMore &&
                            <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center', fontStyle: 'italic' }}>
                              All tokens loaded.
                            </Typography>
                          }
                          {loading && <BouncingDotsLoader />}
                        </Box>
                      </>
                    )}
              </Box>
            </>
          ) : (
            <>
              {/* Mobile / smaller screen layout */}
              <Box sx={{ py: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid xs={4} sm={6}>
                    <Typography sx={{ ml: 2 }}>
                      Token
                    </Typography>
                  </Grid>
                  <Grid xs={4} sm={3}>
                    <Typography>
                      Price
                    </Typography>
                    <Typography>
                      % Change
                    </Typography>
                  </Grid>
                  <Grid xs={4} sm={3}>
                    <Typography>
                      Volume
                    </Typography>
                    <Typography>
                      Transactions
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ overflowX: 'hidden' }}>
                {loading && initialLoading
                  ? (
                    <Box sx={{ position: 'relative', minHeight: '300px' }}>
                      <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          <CircularProgress size={60} />
                        </Box>
                        <Typography>
                          Loading assets...
                        </Typography>
                      </Box>
                    </Box>
                  ) : error ? (
                    <Box sx={{ position: 'relative', minHeight: '300px' }}>
                      <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <Typography sx={{ mb: 2 }}>
                          {error}
                        </Typography>
                        <Button variant="outlined" onClick={() => window.location.reload()}>
                          Reload the page
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      {filteredTokens.map((token, i) => (
                        <Box
                          key={`${token.tokenId}-${i}`}
                          sx={{
                            py: 1,
                            background: i % 2 ? '' : theme.palette.background.paper,
                            userSelect: 'none',
                            '&:hover': {
                              background: theme.palette.background.hover,
                              cursor: 'pointer'
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/tokens/${token.tokenId}`);
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid xs>
                              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, ml: 1 }}>
                                <Avatar src={token.icon} sx={{ width: { xs: '20px', sm: '36px' }, height: { xs: '20px', sm: '36px' } }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {token.name}
                                  </Typography>
                                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {token.ticker.toUpperCase()}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid xs={4} sm={3}>
                              <Typography>
                                {currencies[currency] + formatNumber(currency === 'ERG' ? token.price : token.price * ergExchange, 4)}
                              </Typography>
                              <Typography>
                                {formatPercent(token.pctChange1d * 100)}
                              </Typography>
                            </Grid>
                            <Grid xs={4} sm={3}>
                              <Typography>
                                V {currencies[currency] + formatNumber(currency === 'ERG' ? token.vol : token.vol * ergExchange, 2)}
                              </Typography>
                              <Typography>
                                T {token.buys + token.sells}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Box ref={view} sx={{ minHeight: '24px' }}>
                        {noMore &&
                          <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center', fontStyle: 'italic' }}>
                            All tokens loaded.
                          </Typography>
                        }
                        {loading && <BouncingDotsLoader />}
                      </Box>
                    </>
                  )}
              </Box>
            </>
          )}
      </Paper>
    </Container>
  );
};

export default Tokens;
