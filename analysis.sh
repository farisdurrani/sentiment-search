for Y in 2007 2008 2014 2009 2019 2010 2016 2021 2011 2012 2013 2015 2017 2018 2020 2022
do
    for M in 01 02 03 04 05 06 07 08 09 10 11 12
    do
        printf 'python3 analysis.py %s %s\n' $Y $M
    done
done
