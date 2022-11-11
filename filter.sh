source $HOME/env/bin/activate

for Y in 2007 2008 2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020 2021
do
    for M in 01 02 03 04 05 06 07 08 09 10 11 12
    do
        CSV_FILE=RS_${Y}-${M}.csv
        ./dbxcli get /DVA_Datasets/Reddit/csv.txz/${CSV_FILE}.txz
        tar xvf ${CSV_FILE}.txz
        python reddit-filter.py -y $Y -m $M -t 50
        zip -9 out-${CSV_FILE}.zip out-${CSV_FILE}
        ./dbxcli put out-${CSV_FILE}.zip /DVA_Datasets/Reddit/filtered.zip/${CSV_FILE}.zip
        rm ${CSV_FILE}.txz ${CSV_FILE} out-${CSV_FILE} out-${CSV_FILE}.zip
    done
done
