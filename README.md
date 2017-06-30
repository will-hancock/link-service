# Link service

This service will take a number of URIs and resolve them, recursively inspecting the results and resolving any further links in the process.

## Install

```
yarn
```

## Test

```
yarn test
```

## Run

```
yarn start
```

## Usage

The API is a single endpoint `resolve` that takes a `links` query. The `links` are an array of URIs to be resolved.

```
curl "http://localhost:9000/resolve?links=\[%22/station/1072%22,%22/ticket-type/SOS%22\]"
{"links":{"/station/1072":{"name":{"station":null,"location":"LONDON TERMINALS","display":"London Terminals","print":"London Terminals"},"code":{"nlc":"1072","uic":"7010720","crs":null,"tiploc":null,"atco":null},"latitude":null,"longitude":null,"facilities":[],"groups":[],"clusters":["Q000","Q612","Q617","Q621","Q659","Q666","Q806","Q807","Q808","Q809","Q811","Q812","Q814","Q815","Q816","Q817","Q818","Q819","Q820","Q821","Q822","Q823","Q824","Q850","Q851","Q852","Q853","Q854","Q859","Q860","Q861","Q862","Q863","Q864","Q865","Q866","Q902","Q903","Q908","Q923","Q929","Q952","Q992","QB65","QB84","QB98","QC10","QC15","QC16","QC18","QD00","R401","R667","R711","S301","T004","T027","T113","T143","T213","T301","T401"],"londonTerminals":[],"isGoldCardLocation":true},"/ticket-type/SOS":{"name":{"display":"Anytime Single","print":"Anytime Single","description":"ANYTIME S"},"ccst_format":"X01","code":"SOS","validity":"/validity-type/40","isReturn":false,"isSeason":false,"isAdvance":false,"isPackage":false,"isCarnet":false,"isFirstClass":false},"/validity-type/40":{"code":"40","outward":{"days":2,"months":0,"break":true},"return":{"days":0,"months":0,"break":false},"returnMustBeAfter":{"days":0,"months":0,"dayOfWeek":null}}}}
```

Caching can be configured per URI type in the `config/[env].ts` file.

## How does it work

```
                                     +--------------------------------------------+
                                     |                                            | Y
                                     |                                            |
    +--------------------+   +-------v-------+   +------------------+   +---------+--------+    +-----------------+
    |                    |   |               |   |                  | Y |                  | N  |                 |
+--->  Create Recursive  +--->  Resolve URI  +--->  Proxy has item  +--->  Item has nested +---->  Return result  |
    |  Request Context*  |   |               |   |     in cache     |   |  links inside it |    |                 |
    |                    |   |               |   |                  |   |                  |    |                 |
    +--------------------+   +---------------+   +--------+---------+   +---------^--------+    +-----------------+
                                                          |                       |
                                                       N  |                       |
                                                          |                       |
                                                 +--------v---------+   +---------+--------+
                                                 |                  |   |                  |
                                                 |  Get using HTTP  +--->  Add result and  |
                                                 |      Request     |   |  links to cache  |
                                                 |                  |   |                  |
                                                 +------------------+   +------------------+

```

\* Recursive Request Context is fancy language for an object that stores all the resolved links to be returned in the 
response. 


## TODO

- key and value blacklists (e.g. literal keys "uri" and regex values)

## License

GPL-3.0
