/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.discriminatorTests = {
    simpleDiscriminatorTest: function (test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            },
            type: "dataModel"
        };

        var models = {
            firstModel: {
                discriminator: "type"
            },
            dataModel: {
                required: ["sample"],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: ["top", "left"],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models.firstModel, models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },

    nestedDiscriminatorTest: function (test) {
        var data = {
            items: [
                {
                    type: "subModel1",
                    top: 1,
                    left: 1
                },
                {
                    type: "subModel2",
                    right: 1,
                    bottom: 1
                }
            ]
        };

        var models = {
            firstModel: {
                required: ["items"],
                properties: {
                    items: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/baseModel"
                        }
                    }
                }
            },
            baseModel: {
                required: ["type"],
                properties: {
                    type: {
                        type: "string"
                    }
                },
                discriminator: 'type'
            },
            subModel1: {
                allOf: [
                    {
                        $ref: "#/definitions/baseModel"
                    },
                    {
                        required: ["top", "left"],
                        properties: {
                            top: {
                                type: "integer"
                            },
                            left: {
                                type: "integer"
                            }
                        }
                    }
                ]
            },
            subModel2: {
                allOf: [
                    {
                        $ref: "#/definitions/baseModel"
                    },
                    {
                        required: ["right", "bottom"],
                        properties: {
                            right: {
                                type: "integer"
                            },
                            bottom: {
                                type: "integer"
                            }
                        }
                    }
                ]
            }
        };

        var errors = validator.validate(data, models.firstModel, models, false, true);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    }
};
