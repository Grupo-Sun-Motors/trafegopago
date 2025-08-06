/* @tweakable number of months in semester for averaging calculations */
const SEMESTER_MONTHS = 6;

/* @tweakable colors for positive and negative performance indicators */
const INDICATOR_COLORS = {
    positive: '#059669',
    negative: '#dc2626',
    neutral: '#6b7280',
    new: '#2563eb'
};

const campaignData = {
    "kia": {
        "meta": {
            "semester": [
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Bongo",
                    "Valor usado (BRL)": 4543.16,
                    "Resultados": 625.0,
                    "Cliques no link": 3904.0,
                    "Impressões": 449220.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Sportage",
                    "Valor usado (BRL)": 4552.61,
                    "Resultados": 520.0,
                    "Cliques no link": 4238.0,
                    "Impressões": 190433.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Passeio (Niro)",
                    "Valor usado (BRL)": 2215.1,
                    "Resultados": 193.0,
                    "Cliques no link": 1547.0,
                    "Impressões": 96576.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Carnival",
                    "Valor usado (BRL)": 340.14,
                    "Resultados": 47.0,
                    "Cliques no link": 298.0,
                    "Impressões": 23684.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | EV5",
                    "Valor usado (BRL)": 341.33,
                    "Resultados": 49.0,
                    "Cliques no link": 365.0,
                    "Impressões": 20417.0
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Bongo",
                    "Valor usado (BRL)": 770.5,
                    "Resultados": 116.0,
                    "Cliques no link": 669.0,
                    "Impressões": 64878.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Sportage",
                    "Valor usado (BRL)": 818.22,
                    "Resultados": 75.0,
                    "Cliques no link": 503.0,
                    "Impressões": 28000.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Passeio (Niro)",
                    "Valor usado (BRL)": 275.39,
                    "Resultados": 26.0,
                    "Cliques no link": 196.0,
                    "Impressões": 11393.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Carnival",
                    "Valor usado (BRL)": 375.48,
                    "Resultados": 46.0,
                    "Cliques no link": 358.0,
                    "Impressões": 24782.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | EV5",
                    "Valor usado (BRL)": 216.54,
                    "Resultados": 24.0,
                    "Cliques no link": 199.0,
                    "Impressões": 10446.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | KIA | Stonic",
                    "Valor usado (BRL)": 294.0,
                    "Resultados": 31.0,
                    "Cliques no link": 183.0,
                    "Impressões": 11972.0
                }
            ]
        },
        "google": {
            "semester": [
                {"Campanha": "[Amanita] [PMAX] Sportage", "Custo": "1501,37", "Interações": "12.012", "Impr.": "410.939", "Cliques": "4152.0", "Conversões": "459,97"},
                {"Campanha": "15 [Pesquisa] Sportage", "Custo": "1546,65", "Interações": "2074.0", "Impr.": "84.465", "Cliques": "2074.0", "Conversões": "136,55"},
                {"Campanha": "08 [Pesquisa] Stonic", "Custo": "457,53", "Interações": "1166.0", "Impr.": "28.948", "Cliques": "1166.0", "Conversões": "19,00"},
                {"Campanha": "03 [Pesquisa] Bongo", "Custo": "1970,16", "Interações": "1390.0", "Impr.": "43.628", "Cliques": "1390.0", "Conversões": "59,62"},
                {"Campanha": "[Amanita] [PMAX] Bongo", "Custo": "2094,96", "Interações": "13392.0", "Impr.": "932.828", "Cliques": "7259.0", "Conversões": "526,01"},
                {"Campanha": "01 [Pesquisa] Institucional", "Custo": "3213,47", "Interações": "7907.0", "Impr.": "42.733", "Cliques": "7907.0", "Conversões": "1.388,87"},
                {"Campanha": "16 [Pesquisa] Niro", "Custo": "1155,81", "Interações": "1535.0", "Impr.": "41.174", "Cliques": "1535.0", "Conversões": "88,35"}
            ],
            "july": [
                {"Campanha": "15 [Pesquisa] Sportage", "Custo": "213,77", "Interações": "516.0", "Impr.": "24929.0", "Cliques": "516.0", "Conversões": "39,71"},
                {"Campanha": "08 [Pesquisa] Stonic", "Custo": "63,02", "Interações": "188.0", "Impr.": "3593.0", "Cliques": "188.0", "Conversões": "0,00"},
                {"Campanha": "[Amanita] [PMAX] Sportage", "Custo": "457,67", "Interações": "2171.0", "Impr.": "69124.0", "Cliques": "1875.0", "Conversões": "133,94"},
                {"Campanha": "03 [Pesquisa] Bongo", "Custo": "152,76", "Interações": "332.0", "Impr.": "7.47", "Cliques": "332.0", "Conversões": "26,00"},
                {"Campanha": "[Amanita] [PMAX] Bongo", "Custo": "458,56", "Interações": "3584.0", "Impr.": "99957.0", "Cliques": "2028.0", "Conversões": "121,00"},
                {"Campanha": "01 [Pesquisa] Institucional", "Custo": "425,28", "Interações": "1467.0", "Impr.": "9759.0", "Cliques": "1467.0", "Conversões": "247,52"},
                {"Campanha": "16 [Pesquisa] Niro", "Custo": "207,84", "Interações": "436.0", "Impr.": "10417.0", "Cliques": "436.0", "Conversões": "51,79"}
            ]
        }
    },
    "suzuki": {
        "meta": {
            "semester": [
                {
                    "Nome da campanha": "[Amanita] Suzuki - GSX-8S",
                    "Valor usado (BRL)": 1451.14,
                    "Resultados": 375.0,
                    "Cliques no link": 2301.0,
                    "Impressões": 169354.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - V-Strom 650",
                    "Valor usado (BRL)": 1163.87,
                    "Resultados": 100.0,
                    "Cliques no link": 1071.0,
                    "Impressões": 109473.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - V-Strom 800 DE",
                    "Valor usado (BRL)": 810.05,
                    "Resultados": 77.0,
                    "Cliques no link": 732.0,
                    "Impressões": 67301.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - GSX-8R",
                    "Valor usado (BRL)": 952.54,
                    "Resultados": 48.0,
                    "Cliques no link": 738.0,
                    "Impressões": 50082.0
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Amanita] Suzuki - GSX-8S",
                    "Valor usado (BRL)": 308.87,
                    "Resultados": 69.0,
                    "Cliques no link": 457.0,
                    "Impressões": 35434.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - V-Strom 650",
                    "Valor usado (BRL)": 368.48,
                    "Resultados": 25.0,
                    "Cliques no link": 319.0,
                    "Impressões": 26770.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - V-Strom 800 DE",
                    "Valor usado (BRL)": 183.98,
                    "Resultados": 23.0,
                    "Cliques no link": 193.0,
                    "Impressões": 10412.0
                },
                {
                    "Nome da campanha": "[Amanita] Suzuki - GSX-8R",
                    "Valor usado (BRL)": 370.92,
                    "Resultados": 36.0,
                    "Cliques no link": 308.0,
                    "Impressões": 24332.0
                }
            ]
        },
        "google": {
            "semester": [
                {
                    "Nome da campanha": "[Pesquisa] V-Strom 650",
                    "Valor usado (BRL)": 442.19,
                    "Resultados": 48.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 708.0,
                    "Impressões": 39875.0,
                    "CPC (custo por clique no link) (BRL)": 0.6245621468926554
                },
                {
                    "Nome da campanha": "03 [Pesquisa] V-strom 800de",
                    "Valor usado (BRL)": 1686.82,
                    "Resultados": 98.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 1288.0,
                    "Impressões": 52761.0,
                    "CPC (custo por clique no link) (BRL)": 1.3096428571428572
                },
                {
                    "Nome da campanha": "14 [Pesquisa] Gsx8s",
                    "Valor usado (BRL)": 635.99,
                    "Resultados": 7.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 406.0,
                    "Impressões": 6726.0,
                    "CPC (custo por clique no link) (BRL)": 1.5664778325123153
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Pesquisa] V-Strom 650",
                    "Valor usado (BRL)": 300.59,
                    "Resultados": 30.5,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 406.0,
                    "Impressões": 17934.0,
                    "CPC (custo por clique no link) (BRL)": 0.7403694581280788
                },
                {
                    "Nome da campanha": "14 [Pesquisa] Gsx8s",
                    "Valor usado (BRL)": 80.88,
                    "Resultados": 0.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 49.0,
                    "Impressões": 1019.0,
                    "CPC (custo por clique no link) (BRL)": 1.650612244897959
                },
                {
                    "Nome da campanha": "03 [Pesquisa] V-strom 800de",
                    "Valor usado (BRL)": 60.45,
                    "Resultados": 2.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 119.0,
                    "Impressões": 3557.0,
                    "CPC (custo por clique no link) (BRL)": 0.5079831932773109
                }
            ]
        }
    },
    "haojue": {
        "meta": {
            "semester": [
                {
                    "Nome da campanha": "[Amanita] Always On | Master Ride",
                    "Valor usado (BRL)": 2016.73,
                    "Resultados": 224.0,
                    "Cliques no link": 1865.0,
                    "Impressões": 117474.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | DR160",
                    "Valor usado (BRL)": 2733.71,
                    "Resultados": 358.0,
                    "Cliques no link": 2264.0,
                    "Impressões": 231977.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | DK160",
                    "Valor usado (BRL)": 1476.97,
                    "Resultados": 209.0,
                    "Cliques no link": 956.0,
                    "Impressões": 99347.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | NK150",
                    "Valor usado (BRL)": 1633.47,
                    "Resultados": 251.0,
                    "Cliques no link": 2025.0,
                    "Impressões": 148052.0
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Amanita] Always On | Master Ride",
                    "Valor usado (BRL)": 649.14,
                    "Resultados": 58.0,
                    "Cliques no link": 515.0,
                    "Impressões": 35826.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | DR160",
                    "Valor usado (BRL)": 847.07,
                    "Resultados": 91.0,
                    "Cliques no link": 472.0,
                    "Impressões": 49714.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | DK160",
                    "Valor usado (BRL)": 539.77,
                    "Resultados": 50.0,
                    "Cliques no link": 279.0,
                    "Impressões": 28640.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | NK150",
                    "Valor usado (BRL)": 890.39,
                    "Resultados": 130.0,
                    "Cliques no link": 898.0,
                    "Impressões": 61269.0
                },
                {
                    "Nome da campanha": "[Amanita] Always On | DL160",
                    "Valor usado (BRL)": 273.24,
                    "Resultados": 30.0,
                    "Cliques no link": 230.0,
                    "Impressões": 27865.0
                }
            ]
        },
        "google": {
            "semester": [
                {
                    "Nome da campanha": "10 [Pesquisa] Chopper",
                    "Valor usado (BRL)": 419.97,
                    "Resultados": 11.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 288.0,
                    "Impressões": 3758.0,
                    "CPC (custo por clique no link) (BRL)": 1.4582291666666667
                },
                {
                    "Nome da campanha": "24 [Pesquisa] DR 160",
                    "Valor usado (BRL)": 700.51,
                    "Resultados": 54.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 1287.0,
                    "Impressões": 32.62,
                    "CPC (custo por clique no link) (BRL)": 0.5443006993006993
                },
                {
                    "Nome da campanha": "02 [Pesquisa] Nk 150",
                    "Valor usado (BRL)": 901.1,
                    "Resultados": 44.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 955.0,
                    "Impressões": 53256.0,
                    "CPC (custo por clique no link) (BRL)": 0.9435602094240838
                },
                {
                    "Nome da campanha": "04 [Pesquisa] Dk 150",
                    "Valor usado (BRL)": 974.08,
                    "Resultados": 60.5,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 1429.0,
                    "Impressões": 59.8,
                    "CPC (custo por clique no link) (BRL)": 0.6816515045486354
                },
                {
                    "Nome da campanha": "01 [Pesquisa] Master Ride",
                    "Valor usado (BRL)": 1776.09,
                    "Resultados": 119.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 1742.0,
                    "Impressões": 72301.0,
                    "CPC (custo por clique no link) (BRL)": 1.0195694603903558
                },
                {
                    "Nome da campanha": "[Amanita] [PMAX] Haojue",
                    "Valor usado (BRL)": 1163.41,
                    "Resultados": 687.28,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 6008.0,
                    "Impressões": 211203.0,
                    "CPC (custo por clique no link) (BRL)": 0.19364347536617842
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Amanita] [PMAX] Haojue",
                    "Valor usado (BRL)": 348.81,
                    "Resultados": 419.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 2524.0,
                    "Impressões": 73596.0,
                    "CPC (custo por clique no link) (BRL)": 0.1381973058637084
                },
                {
                    "Nome da campanha": "04 [Pesquisa] Dk 150",
                    "Valor usado (BRL)": 90.25,
                    "Resultados": 6.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 313.0,
                    "Impressões": 11119.0,
                    "CPC (custo por clique no link) (BRL)": 0.28833865814696486
                },
                {
                    "Nome da campanha": "01 [Pesquisa] Master Ride",
                    "Valor usado (BRL)": 282.34,
                    "Resultados": 25.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 233.0,
                    "Impressões": 10.19,
                    "CPC (custo por clique no link) (BRL)": 1.2117596566523605
                },
                {
                    "Nome da campanha": "10 [Pesquisa] Chopper",
                    "Valor usado (BRL)": 161.89,
                    "Resultados": 8.5,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 140.0,
                    "Impressões": 1514.0,
                    "CPC (custo por clique no link) (BRL)": 1.1563571428571428
                },
                {
                    "Nome da campanha": "02 [Pesquisa] Nk 150",
                    "Valor usado (BRL)": 77.12,
                    "Resultados": 8.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 360.0,
                    "Impressões": 12234.0,
                    "CPC (custo por clique no link) (BRL)": 0.21422222222222222
                },
                {
                    "Nome da campanha": "24 [Pesquisa] DR 160",
                    "Valor usado (BRL)": 350.57,
                    "Resultados": 35.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 698.0,
                    "Impressões": 14598.0,
                    "CPC (custo por clique no link) (BRL)": 0.5022492836676218
                }
            ]
        }
    },
    "zontes": {
        "meta": {
            "semester": [
                {
                    "Nome da campanha": "[Amanita] Zontes - V350",
                    "Valor usado (BRL)": 1881.96,
                    "Resultados": 621.0,
                    "Cliques no link": 5811.0,
                    "Impressões": 391393.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - T350 e T350x",
                    "Valor usado (BRL)": 815.22,
                    "Resultados": 102.0,
                    "Cliques no link": 797.0,
                    "Impressões": 76707.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - Tactic 400",
                    "Valor usado (BRL)": 408.75,
                    "Resultados": 39.0,
                    "Cliques no link": 329.0,
                    "Impressões": 25960.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - S350",
                    "Valor usado (BRL)": 816.27,
                    "Resultados": 213.0,
                    "Cliques no link": 1520.0,
                    "Impressões": 73533.0
                }
            ],
            "july": [
                {
                    "Nome da campanha": "[Amanita] Zontes - V350",
                    "Valor usado (BRL)": 281.17,
                    "Resultados": 101.0,
                    "Cliques no link": 828.0,
                    "Impressões": 44687.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - T350 e T350x",
                    "Valor usado (BRL)": 308.45,
                    "Resultados": 37.0,
                    "Cliques no link": 247.0,
                    "Impressões": 32141.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - Tactic 400",
                    "Valor usado (BRL)": 121.82,
                    "Resultados": 9.0,
                    "Cliques no link": 64.0,
                    "Impressões": 4091.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - S350",
                    "Valor usado (BRL)": 276.94,
                    "Resultados": 63.0,
                    "Cliques no link": 536.0,
                    "Impressões": 23512.0
                },
                {
                    "Nome da campanha": "(TATI) T 350 EMPLACAMENTO",
                    "Valor usado (BRL)": 359.19,
                    "Resultados": 49.0,
                    "Cliques no link": 321.0,
                    "Impressões": 36847.0
                },
                {
                    "Nome da campanha": "[Amanita] Zontes - E350 Scooter",
                    "Valor usado (BRL)": 277.37,
                    "Resultados": 33.0,
                    "Cliques no link": 292.0,
                    "Impressões": 16970.0
                }
            ]
        },
        "google": {
            "semester": [
                {
                    "Nome da campanha": "12 [Pesquisa] V 350",
                    "Valor usado (BRL)": 336.0,
                    "Resultados": 3.08,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 335.0,
                    "Impressões": 2774.0,
                    "CPC (custo por clique no link) (BRL)": 1.0029850746268657
                },
                {
                    "Nome da campanha": "20 [Pesquisa] R350",
                    "Valor usado (BRL)": 339.3,
                    "Resultados": 3.03,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 300.0,
                    "Impressões": 3.6,
                    "CPC (custo por clique no link) (BRL)": 1.131
                },
                {
                    "Nome da campanha": "17 [Pesquisa] GK350",
                    "Valor usado (BRL)": 256.98,
                    "Resultados": 2.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 216.0,
                    "Impressões": 2515.0,
                    "CPC (custo por clique no link) (BRL)": 1.1897222222222223
                },
                {
                    "Nome da campanha": "06 [Pesquisa] T 350",
                    "Valor usado (BRL)": 716.02,
                    "Resultados": 34.88,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 946.0,
                    "Impressões": 7597.0,
                    "CPC (custo por clique no link) (BRL)": 0.756892177589852
                }
            ],
            "july": [
                {
                    "Nome da campanha": "06 [Pesquisa] T 350",
                    "Valor usado (BRL)": 346.19,
                    "Resultados": 21.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 352.0,
                    "Impressões": 2584.0,
                    "CPC (custo por clique no link) (BRL)": 0.9834943181818182
                },
                {
                    "Nome da campanha": "17 [Pesquisa] GK350",
                    "Valor usado (BRL)": 80.2,
                    "Resultados": 1.0,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 80.0,
                    "Impressões": 1236.0,
                    "CPC (custo por clique no link) (BRL)": 1.0025
                },
                {
                    "Nome da campanha": "12 [Pesquisa] V 350",
                    "Valor usado (BRL)": 87.69,
                    "Resultados": 2.5,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 73.0,
                    "Impressões": 679.0,
                    "CPC (custo por clique no link) (BRL)": 1.2012328767123288
                },
                {
                    "Nome da campanha": "20 [Pesquisa] R350",
                    "Valor usado (BRL)": 82.32,
                    "Resultados": 3.5,
                    "Custo por resultados": 0.0,
                    "Cliques no link": 62.0,
                    "Impressões": 798.0,
                    "CPC (custo por clique no link) (BRL)": 1.327741935483871
                }
            ]
        }
    }
};