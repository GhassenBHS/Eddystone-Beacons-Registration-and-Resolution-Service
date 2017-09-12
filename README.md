# Eddystone-Beacons-Registration-and-Resolution-Service
Engineering Graduation Project


# Objective

This work is an implementation and test of an open source RESTful web service to register and
resolve Eddytsone-EID beacons.

## Functional Requirements

 1. Allow a beacon owner to authenticate.
 2. Register Eddystone-EID beacons.
 3. Resolve-EID beacons.
 4. Activate, deactivate or delete a registered beacon.


## Webservice Routes

1. https://beacon-resolution-service.herokuapp.com/register
2. https://beacon-resolution-service.herokuapp.com/resolve
3. https://beacon-resolution-service.herokuapp.com/modify
4. https://beacon-resolution-service.herokuapp.com/authenticate

Every route is handled by a js file in the “routes” folder that contains minimum logic.
Basically, a file in the routes folder retrieves the data from requests and calls a controller function.
Once output is ready, it fires the response to the requester.



## Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc

