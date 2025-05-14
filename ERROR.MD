

clear_thought
mentalmodel
modelName
"first_principles"
problem

output
            [
  {
    "code": "invalid_union",
    "unionErrors": [
      {
        "issues": [
          {
            "received": "application/json",
            "code": "invalid_literal",
            "expected": "text",
            "path": [
              "content",
              0,
              "type"
            ],
            "message": "Invalid literal value, expected \"text\""
          }
        ],
        "name": "ZodError"
      },
      {
        "issues": [
          {
            "received": "application/json",
            "code": "invalid_literal",
            "expected": "image",
            "path": [
              "content",
              0,
              "type"
            ],
            "message": "Invalid literal value, expected \"image\""
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "content",
              0,
              "data"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "content",
              0,
              "mimeType"
            ],
            "message": "Required"
          }
        ],
        "name": "ZodError"
      },
      {
        "issues": [
          {
            "received": "application/json",
            "code": "invalid_literal",
            "expected": "resource",
            "path": [
              "content",
              0,
              "type"
            ],
            "message": "Invalid literal value, expected \"resource\""
          },
          {
            "code": "invalid_union",
            "unionErrors": [
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "object",
                    "received": "undefined",
                    "path": [
                      "content",
                      0,
                      "resource"
                    ],
                    "message": "Required"
                  }
                ],
                "name": "ZodError"
              },
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "object",
                    "received": "undefined",
                    "path": [
                      "content",
                      0,
                      "resource"
                    ],
                    "message": "Required"
                  }
                ],
                "name": "ZodError"
              }
            ],
            "path": [
              "content",
              0,
              "resource"
            ],
            "message": "Invalid input"
          }
        ],
        "name": "ZodError"
      }
    ],
    "path": [
      "content",
      0
    ],
    "message": "Invalid input"
  }
]