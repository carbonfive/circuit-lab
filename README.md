## Carbon Five Circuit Lab

### BeagleBone Black setup (with default Angstrom distribution)

#### Set the date (otherwise SSL can fail)
    ntpdate time.apple.com

#### Change the time zone
    cd /etc
    rm ./localtime
    ln -s /usr/share/zoneinfo/America/Los_Angeles ./localtime

#### Install gtk
opkg install gtk+-dev

#### Get code and boot server
    git clone git@github.com:carbonfive/circuit-lab.git
    cd circuit-lab
    npm install
    node server.js

Note, if you run into SSL issues, try setting the time:
    ntpdate -b -s -u 0.us.pool.ntp.org
