#!/usr/bin/env bash
sudo /usr/sbin/ntpd -s

sudo rm -rf /home/node/.config/qlug-core/*
sudo rm -rf /home/node/.local/state/qlug-core/*
sudo chown node:node -R /home/node
sudo ln -s /home/node/.yarn/bin/qlug /usr/bin/qlug
qlug config:publish --network=$NETWORK
sudo rm -f /home/node/.config/qlug-core/$NETWORK/.env

if [ "$MODE" = "forger" ]; then
  SECRET=`openssl rsautl -decrypt -inkey /run/secrets/secret.key -in /run/secrets/secret.dat`
  CORE_FORGER_PASSWORD=`openssl rsautl -decrypt -inkey /run/secrets/bip.key -in /run/secrets/bip.dat`

  # configure
  if [ -n "$SECRET" ] && [ -n "$CORE_FORGER_PASSWORD" ]; then
    qlug config:forger:bip38 --bip39 "$SECRET" --password "$CORE_FORGER_PASSWORD"
  elif [ "$MODE" = "forger" ] && [ -z "$SECRET" ] && [ -z "$CORE_FORGER_PASSWORD" ]; then
    echo "set SECRET and/or CORE_FORGER_PASWORD if you want to run a forger"
    exit
  elif [ -n "$SECRET" ] && [ -z "$CORE_FORGER_PASSWORD" ]; then
    qlug config:forger:bip39 --bip39 "$SECRET"
  fi
fi

# relay
if [[ "$MODE" = "relay" ]]; then
    qlug relay:run
fi

# forging
if [ "$MODE" = "forger" ] && [ -n "$SECRET" ] && [ -n "$CORE_FORGER_PASSWORD" ]; then
    export CORE_FORGER_BIP38=$(grep bip38 /home/node/.config/ark-core/$NETWORK/delegates.json | awk '{print $2}' | tr -d '"')
    export CORE_FORGER_PASSWORD
    sudo rm -rf /run/secrets/*
    qlug core:run
elif [ "$MODE" = "forger" ] && [ -z "$SECRET" ] && [ -z "$CORE_FORGER_PASSWORD" ]; then
    echo "set SECRET and/or CORE_FORGER_PASWORD if you want to run a forger"
    exit
elif [ "$MODE" = "forger" ] && [ -n "$SECRET" ] && [ -z "$CORE_FORGER_PASSWORD" ]; then
    qlug core:run
fi
