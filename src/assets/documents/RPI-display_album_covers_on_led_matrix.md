
# Project Guide


<br/>

## Description

[Original Project by Reddit user u/gonnabuysomewindows](https://www.reddit.com/r/raspberry_pi/comments/ombwwg/my_64x64_rgb_led_matrix_album_art_display_pi_3b/)

This guide just provides a deeper look at the software setup, with a few modifications. 
The goal of this project is to set up the Raspberry Pi as an Airplay receiver so you can connect to it with an Apple device and display the album cover of your currently playing song on Apple Music. 

<br/><b>Difficulty:</b> 
<br/>Intermediate/Advanced 
<br/>
<br/><b>Prereqs:</b>
* An Airplay 2 enabled Apple device
* A soldering iron and tools to set up the hardware
* Basic knowldege of linux systems
* Basic knowldege of the command line

<br/>

This guide covers the software setup of the project. The hardware setup can be found on Adafruit's website (see product links below).

<br/>

## Hardware
I sourced all the comoponents for this project from Adafruit. 
* [Raspberry Pi 4 Model B] - For running servers and Airplay receiver 
* [RGB Matrix Hat + RTC] - Allows the pi to control the LED matrix 
* [5V 4A Power Supply] - Required to power the matrix and hat
* 2x  [64x32 RGB LED Matrix - 4mm pitch] - The screens that will display the album cover 

The original project uses a Pi 3, although a Pi 2 might work as well. 
<br/>The original project uses an RGB Matrix Bonnet (also from Adafruit). 
<br/>The 5V 4A PSU will power both the matrix and the Pi so the separate Pi power supply is not strictly necessary, although I've experienced failures more often when using just one power supply, so I use both.
<br/>The original project uses a single 64x64 RGB LED matrix (also from Adafruit). 

## Software
There are 4 servers required for this project, all of which run direclty on the pi.
* flaschen-taschen - A server to receive images and display them on the matrix 
* MQTT Broker (Mosquitto) - A pub/sub network protocol for IOT messaging
* shairport-sync - Turns the pi into an Airplay receiver 
* shairport-sync-mqtt-display - A utility to display shairport-sync metadata via MQTT 

<b>You will also need to download rpi-rgb-led-matrix in order to run a flaschen-taschen server.</b> This is already covered in the Adafruit RGB Matrix setup tutorial, so I will not cover it here. 
<br/>
<br/>To make the project a little easier, you can set up your pi os with default username "pi". If you already have another username set, then you will just need to modify some files in the shairport-sync projects. 


## Setup
### flaschen-taschen 
https://github.com/hzeller/flaschen-taschen
##### Install
To install flaschen-taschen, run the following commands:
```sh
    git clone --recursive https://github.com/hzeller/flaschen-taschen.git
```
You can clone this repo wherever you like, although mine is in the home directory.
##### Start
Go to the server directory:
```sh
    cd flaschen-taschen/server
```
If you have already set up your LED matrix with the rpi-rgb-led-matrix project, you can make the ft server like so:
```sh
    make FT_BACKEND=rgb-matrix
```
Otherwise you can make the ft server to emulate a matrix in the terminal:
```sh
    make FT_BACKEND=terminal
```
Now you can start the server. I am using 2 chained 64x32 rgb led matrix, so I run the following command. If you are using different hardware, you may need to set different flags.
```sh
    sudo ./ft-server --led-gpio-mapping=adafruit-hat --led-slowdown-gpio=5 --led-no-hardware-pulse --led-chain=2 --led-rows=32 --led-cols=64 --led-multiplexing=0 --led-pixel-mapper=V-mapper
```
These are the same flags used in rpi-rgb-led-matrix. See the [github] for more info.
<br/><br/>After starting the server, you should see the following output:
```sh
    Running with 64x64 resolution
    UDP-server: ready to listen on 1337
```
To stop the server, press ctrl+c.

##### Testing
To test the server, open a new terminal window and go to the client folder:
```sh
    cd flaschen-taschen/client
```
Compile the send-image file:
```sh
    make send-image
```
Now send an image to the server:
```sh
    ./send-image -g 64x64 -h localhost /path/to/some/image.png
```
You should see the image display on your led matrix.

### mosquitto
https://pimylifeup.com/raspberry-pi-mosquitto-mqtt-server/

##### Install
To install Mosquitto, run the following commands:
```sh
    sudo apt update
    sudo apt upgrade
    sudo apt install mosquitto mosquitto-clients
```
To verify installation: 
```sh
    mosquitto -v
```
##### Configure
https://github.com/idcrook/shairport-sync-mqtt-display/wiki/Configure-mosquitto-MQTT-broker
The config file is located here:
```sh
    /etc/mosquitto/conf.d/mosquitto.conf
```
I am using the default config:

```sh
    # mosquitto.conf

    user mosquitto
    max_queued_messages 200
    message_size_limit 0
    allow_duplicate_messages false
    connection_messages true
    log_timestamp true

    # Defaults to error, warning, notice and information
    # debug, error, warning, notice, information, subscribe, unsubscribe, websockets, none, all
    #log_type all
    #log_type debug

    #autosave_interval 900
    # Set to 10800 seconds (3 hours)
    ##autosave_interval 10800
    ##autosave_on_changes false

    # `autosave_on_changes` changes `autosave_interval` to mean: number of
    #     subscription changes, retained messages received and queued messages
    autosave_interval 8000
    autosave_on_changes true

    ########################################
    # new in mosquitto 1.5
    ########################################
    per_listener_settings true

    # #######################################
    # # TCP MQTT listener
    # #######################################
    listener 1883
    allow_anonymous true
```
##### Start
To start the server:
```sh
    sudo systemctl enable mosquitto
    sudo systemctl start mosquitto
```
To check the server is running:
```sh
    sudo systemctl status mosquitto
```
You should see some output like this:
```sh
    mosquitto.service - Mosquitto MQTT Broker
        Loaded: loaded (/lib/systemd/system/mosquitto.service; enabled; vendor preset: enabled)
        Active: active (running) since Sun 2022-07-31 19:36:34 EDT; 18h ago
          Docs: man:mosquitto.conf(5)
                man:mosquitto(8)
```
##### Commands
```sh
    sudo systemctl start mosquitto
    sudo systemctl stop mosquitto
    sudo systemctl restart mosquitto
    sudo systemctl status mosquitto
    journalctl -u mosquitto
```

The log file is located here, with elevated permissions:
```sh
    sudo zless /var/log/mosquitto/mosquitto.log
```

### shairport-sync
https://github.com/mikebrady/shairport-sync

##### Install
https://github.com/idcrook/shairport-sync-mqtt-display/wiki/Build-shairport-sync-with-MQTT-support-on-Raspberry-Pi
<br/>We will be installing the version of shairport-sync with Airplay 2 support. This is so we can connect to an AP2 speaker, alongside the LED Matrix
<br/>To install shairport-sync dependencies, run the following commands:
```sh
    sudo apt update
    sudo apt upgrade # this is optional but recommended
    sudo apt install --no-install-recommends build-essential git xmltoman autoconf automake libtool \
        libpopt-dev libconfig-dev libasound2-dev avahi-daemon libavahi-client-dev libssl-dev libsoxr-dev \
        libplist-dev libsodium-dev libavutil-dev libavcodec-dev libavformat-dev uuid-dev libgcrypt-dev xxd
```


Next we will clone the shairport-sync repo into a new "projects" folder. You can technically clone the repo to any location, but you may get less errors by cloning into
the projects folder. I think this is due to some paths being hardcoded in, although you could just modify those files. 
```sh
    cd ~
    mkdir projects
    cd projects
    git clone https://github.com/mikebrady/shairport-sync.git
```

We also need to install NQPTP. This is required to provide timing info for Airplay 2.
<br/>To install NQPTP:
```sh
    cd ~/projects
    git clone https://github.com/mikebrady/nqptp.git
    cd nqptp
    autoreconf -fi
    ./configure --with-systemd-startup
    make
    sudo make install
```

We're switching to the development branch of shairport-sync, since that is where Airplay 2 is supported. 
<br/>Build shairport-sync with Airplay 2, systemd, metadata and MQTT support:
```sh
    cd ~/projects/shairport-sync
    git checkout development
    autoreconf -fi
    $ ./configure --sysconfdir=/etc --with-alsa \
        --with-soxr --with-avahi --with-ssl=openssl --with-systemd --with-airplay-2 --with-mqtt-client
    make
    sudo make install
```
##### Configure 
Open the following file in some text editor (nano, vim, geany):
```sh
    /etc/shairport-sync.conf
```
Now scroll down to the metada and mqtt sections. Edit them to match the following:
```sh
    metadata =
    {
      enabled = "yes"; // set this to yes to get Shairport Sync to solicit metadata from the source and to pass it on via a pipe
      include_cover_art = "yes"; // set to "yes" to get Shairport Sync to solicit cover art from the source and pass it via the pipe. You must also set "enabled" to "yes".
    };

    mqtt =
    {
      enabled = "yes";
      hostname = "mqttbrokerhost"; // Hostname of the MQTT Broker
      port = 1883;
      topic = "shairport-sync/rpih1"; //MQTT topic where this instance of shairport-sync should publish. If not set, the general.name value is used.
      publish_parsed = "yes"; //whether to publish a small (but useful) subset of metadata under human-understandable topics
      publish_cover = "yes"; //whether to publish the cover over mqtt in binary form. This may lead to a bit of load on the broker
      enable_remote = "yes"; //whether to remote control via MQTT. RC is available under `topic`/remote.
    }
```
Run the following command to view the config file. This will show all non-commented lines in the config. The output should match the above config.
```sh
    grep -v ^// /etc/shairport-sync.conf
```
Lastly, we will need to add the new hostname "mqttbrokerhost" to the hosts file:
```sh
    sudo nano /etc/hosts
```
Add the following entry:
```sh
    0.0.0.0		mqttbrokerhost
```
Quit nano and save changes to the file.

##### Start
To start the service:
```sh
  sudo systemctl enable shairport-sync
  sudo systemctl start shairport-sync
```
To check the service is running:
```sh
  sudo systemctl status shairport-sync
```
You should see some output like this:
```sh
  shairport-sync.service - Shairport Sync - AirPlay Audio Receiver
      Loaded: loaded (/lib/systemd/system/shairport-sync.service; enabled; vendor preset: enabled)
      Active: active (running) since Mon 2022-08-01 14:00:30 EDT; 3h 47min ago
    Main PID: 26286 (shairport-sync)
        Tasks: 10 (limit: 3720)
          CPU: 52.390s
      CGroup: /system.slice/shairport-sync.service
              └─26286 /usr/local/bin/shairport-sync

  Aug 01 14:00:30 raspberrypi systemd[1]: Started Shairport Sync - AirPlay Audio Receiver.
```
##### Commands
```sh
  less /lib/systemd/system/shairport-sync.service
  sudo systemctl force-reload shairport-sync
  sudo systemctl enable shairport-sync
  sudo systemctl status shairport-sync
  sudo systemctl start shairport-sync
  sudo systemctl stop shairport-sync
  sudo systemctl restart shairport-sync

  journalctl -u shairport-sync
```


### shairport-sync-mqtt-display
https://github.com/idcrook/shairport-sync-mqtt-display/
##### Install
https://github.com/idcrook/shairport-sync-mqtt-display/blob/main/REQUIREMENTS.md#quickstart
<br/>Install a python3 dev setup and other libraries:
```sh
    sudo apt install -y python3-pip python3-venv build-essential \
        python3-setuptools python3-wheel git
```
Again we will clone the repo to the "projects" folder to reduce the risk of errors:
```sh
    cd ~/projects
    git clone https://github.com/idcrook/shairport-sync-mqtt-display.git
```
https://github.com/idcrook/shairport-sync-mqtt-display/blob/main/python-flaschen-taschen/README.md#install
<br/>Install Python Imaging Library (Pillow) and set up python venv:
```sh
    #useful for having PIL in REPL in system python3
    sudo apt install python3-pillow

    cd ~/projects/shairport-sync-mqtt-display/python-flaschen-taschen
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
##### Configure
Create the config file:
```sh
  cp config.example.yaml config.secrets.yaml
```

Open the config file in some text editor (nano, vim, geany):
```sh
    ~/projects/shairport-sync-mqtt-display/python-flaschen-taschen/config.secrets.yaml
```

Now modify the config to match the following:
```sh
    mqtt:
      topic: 'shairport-sync/rpih1'  # there should NOT be a leading slash!
      host: mqttbrokerhost  # a resolvable hostname (e.g. /etc/host entry)
      port: 1883
      username: null
      password: null
      use_tls: false
      tls:
        ca_certs_path: null
        certfile_path: null
        keyfile_path: null
      logger: true

    flaschen:
      server: localhost
      port: 1337
      led-rows: 64
      led-columns: 64

    mqtt:
      topic: 'shairport-sync/name'
      host: rpih1  # this should be a resolvable hostname
      port: 8883
      use_tls: true
      tls:
        ca_certs_path: /path/to/ca_certs  # can be chained.pem or directory
        certfile_path: client_certificate.crt
        keyfile_path: key.pem
        # only for debugging # allow_insecure_server_certificate: false1
```

Notice the mqtt topic, host, and port all match the /etc/shairport-sync.conf file we set up earlier. 
<br/> Also notice the flaschen config matches the earlier ft server setup. 

##### Start
To start the server:
```sh
    cd ~/projects/shairport-sync-mqtt-display/python-flaschen-taschen
    python3 app.py
```
You should see some output like:
```sh
    pi@raspberrypi:~/projects/shairport-sync-mqtt-display/python-flaschen-taschen $ python3 app.py 
    Using default cover image file /home/pi/projects/shairport-sync-mqtt-display/python-flaschen-taschen/../python-flask-socketio-server/static/img/default-inverted.png
    Using config file /home/pi/projects/shairport-sync-mqtt-display/python-flaschen-taschen/config.yaml
    shairport-sync/rpih1
    default-inverted.png PNG (256, 256) x RGB
    <PIL.Image.Image image mode=RGBA size=64x64 at 0xB66B13B8>
    Enabling MQTT logging
    Connecting to broker mqttbrokerhost port 1883
    topic shairport-sync/rpih1/artist 1
    topic shairport-sync/rpih1/album 2
    topic shairport-sync/rpih1/title 3
    topic shairport-sync/rpih1/genre 4
    topic shairport-sync/rpih1/cover 5
    topic shairport-sync/rpih1/songalbum 6
```
To stop the server, press ctrl+c.

## Conclusion
And that's it! With all 4 servers running, you should be able to connect to your raspberry pi via Airplay. Try playing a song and it will display the album cover on the LED matrix.




[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   
   [Raspberry Pi 4 Model B]: <https://www.adafruit.com/product/4292>
   [RGB Matrix Hat + RTC]: <https://www.adafruit.com/product/2345>
   [5V 4A Power Supply]: <https://www.adafruit.com/product/1466>
   [64x32 RGB LED Matrix - 4mm pitch]: <https://www.adafruit.com/product/2278>
   
   [github]: <https://github.com/hzeller/rpi-rgb-led-matrix>
