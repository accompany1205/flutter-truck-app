class User {

  final String name;
  final String password;

  User({this.name, this.password});

  User.fromJson(Map<String, dynamic> json)
      : name = json[''],
        password = json[''];

  Map<String, dynamic> toJson() =>
      {
        '': name,
        '': password,
      };

}