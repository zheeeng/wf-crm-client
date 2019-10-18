enum TimeUnit {
    Ms = 1,
    Second = TimeUnit.Ms * 1000,
    Minute = TimeUnit.Second * 60,
    Hour = TimeUnit.Minute * 60,
    Day = TimeUnit.Hour * 24,
    Week = TimeUnit.Day * 7,
}

export default TimeUnit