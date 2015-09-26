# Interval module

Create and manipulate intervals. An interval in tonal is a string in the form: `(direction)?(number)(quality)` where direction is `'-'` or empty string, number is a positive decimal number and quality is one of `dd`, `d`, `m`, `M`, `A` or `AA`. `'1P'` and `-9m` are valid intervals.

You can get the interval properties with `interval/props` and manipulate in the standard ways: add two intervals, simplify intervals, get opposite...
