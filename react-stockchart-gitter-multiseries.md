so for e.g. you have
data = [
  { date: 1/4/2018 10:00 am, ohlcv },
  { date: 1/4/2018 10:05 am, ohlcv },
  { date: 1/4/2018 10:10 am, ohlcv }
]
so you have 5 min interval data
and lets say the trades are something like
 trades = [
  {  date: 1/4/2018 10:01:20.199 am, buy, 100, $300.34 },
  {  date: 1/4/2018 10:02:20.199 am, buy, 100, $300.34 },
  {  date: 1/4/2018 10:03:20.199 am, buy, 100, $300.34 },
  {  date: 1/4/2018 10:04:20.199 am, buy, 100, $300.34 },
]
does roughly represent your data ?

michaelr524 @michaelr524 Jan 04 22:48
[date, highest_bid, lowest_ask]
more or less this ^

