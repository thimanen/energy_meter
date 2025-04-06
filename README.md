# energy_meter

```mermaid
architecture-beta
  group energy_meter_system(internet)[Energy meter system]
    service shelly_mains(server)[Shelly mains] in energy_meter_system
    service shelly_solar(server)[Shelly solar] in energy_meter_system
    service raspberry(server)[Raspberry] in energy_meter_system
    service database(database)[MongoDB] in energy_meter_system
    service application(internet)[Mobile APP] in energy_meter_system
    junction junctionShelly

    shelly_mains:R -- L:junctionShelly
    shelly_solar:L -- R:junctionShelly
    junctionShelly:B --> T:raspberry
    database:L <--> R:raspberry
    raspberry:B --> T:application


```
