for Y in 2007 2022 2021 2008 2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020 
do
    for M in 01 02 03 04 05 06 07 08 09 10 11 12
    do
        FILE=RS_${Y}-${M}

        dbxcli get /DVA_Datasets/Reddit/result/${FILE}.csv

        python3 analysis.py ${FILE}.csv

        dbxcli put ${FILE}-sentiments.csv /DVA_Datasets/Reddit/tagged/${FILE}-sentiments.csv

        rm -fv ${FILE}-sentiments.csv ${FILE}.csv
    done
done
