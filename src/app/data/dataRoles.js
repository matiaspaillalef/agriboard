export const DataRoles = [
    {
        roles: [
          {
            name: "Superadmin",
            permissions: {
              "read": true,
              "update": true,
              "delete": true,
              "create": true
            }
          },
          {
            name: "Admin",
            permissions: {
              "read": true,
              "update": true,
              "delete": true,
              "create": false
            }
          },
          {
            name: "User",
            permissions: {
              "read": true,
              "update": false,
              "delete": false,
              "create": true
            }
          },
          {
            name: "Cosecheros",
            permissions: {
              "read": true,
              "update": false,
              "delete": false,
              "create": false
            }
          }
      ] 
  } 
];