# GoGaRuCo 2013 - Carbon Five Electronics Soldering Lab

## BeagleBone setup (with default Angstrom distribution):

### Set the date (otherwise SSL wgets can fail)
    ntpdate time.apple.com

### Change the Time Zone
    cd /etc
    rm ./localtime
    ln -s /usr/share/zoneinfo/America/Los_Angeles ./localtime

### Get code and boot server
    git clone git@github.com:ingar/circuit-lab.git
    cd circuit-lab
    npm install
    node server.js