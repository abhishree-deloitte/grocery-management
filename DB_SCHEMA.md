                            ┌──────────────┐
                            │    User      │
                            └──────┬───────┘
                                   │ creates
                                   ▼
                             ┌────────────┐
                             │   Task     │
                             └────────────┘

┌──────────────┐      supplies      ┌──────────────┐      has      ┌──────────────┐
│  Supplier    ├───────────────────▶│   Product    ├──────────────▶│    Stock     │
└──────────────┘                    └──────┬───────┘               └──────┬───────┘
                                           │                              │ has many
                                           │ shipped in                   ▼
                                  ┌────────▼────────┐             ┌──────────────┐
                                  │    Shipment     │◀────────────┤  StockEntry  │
                                  └─────────────────┘             └──────────────┘

                             creates (optional)
                                   ▼
                             ┌────────────┐
                             │   Blog     │
                             └────────────┘
