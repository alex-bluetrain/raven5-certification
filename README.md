# Raven 5 Certification Tests

This project provides some scripts to assist the [Raven 5 Cluster Certification](raven-5-cluster-certification.md) document.

# Deploying in docker

- edit the .env file
- run `docker build . -t raven5tests`

# Deploying manually

- Clone this repository `git clone http://gitlab.leapfactor.net/alex.verstraeten/raven5-certification-tests`
- Edit the .env file
- install NodeJS 16.15.0 or superior
- install yarn `npm install --global yarn`
- install the dependencies: `yarn`
- build the src code `yarn build`

# Running the Tests

## Single Node Test

this test will start writing documents to the 'certification-tests' database every 3 seconds

```
yarn run single-node-test
```

or with docker:

```
docker run --rm -it raven5tests single-node-test
```

## Cluster Wide Test

This test will start writing documents to the 'certification-tests' database every 3 seconds, and will fail if the majority of nodes cannot approve the transaction.

```
yarn run cluster-wide-test
```

or with docker:

```
docker run --rm -it raven5tests cluster-wide-test
```

## Write Assurance Test

This test will start writing documents to `certification-tests` database every 3 seconds and it should fail if the document can't be written at least in 1 replica (with a 30 seconds timeout)

```
yarn run write-assurance-test
```

or with docker:

```
docker run --rm -it raven5tests write-assurance-test
```
