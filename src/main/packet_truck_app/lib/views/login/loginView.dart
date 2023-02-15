import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_signin_button/button_builder.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/views/login/registerView.dart';
import 'package:packet_truck_app/views/menu/menuTabsView.dart';
import 'package:packet_truck_app/widgets/screenTextField.dart';

class LoginView extends StatelessWidget {

    final _formKey = GlobalKey<FormState>();

    final FocusNode _nameFocus = FocusNode();
    final FocusNode _passFocus = FocusNode();

    final TextEditingController _nameController = TextEditingController();
    final TextEditingController _passController = TextEditingController();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
          child: ScreenTextField(
            child: FractionallySizedBox(
                widthFactor: 1,
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                      Column(
                          children: <Widget>[
                            Container(
                                height: 150,
                                child: FlareActor("assets/animation/world_truck.flr", animation:"Untitled", fit: BoxFit.fitHeight,)
                            ),
                              //Icon(Icons.directions_car, size: 80, color: lightColor,),
                              Text('PACKET TRUCK', style: greyLightTitleTextStyle,)
                          ],
                      ),
                      Form(
                          key: _formKey,
                        child: Column(
                            children: <Widget>[
                                FractionallySizedBox(
                                    widthFactor: 0.75,
                                  child: TextFormField(
                                      controller: _nameController,
                                      focusNode: _nameFocus,
                                      decoration: InputDecoration(
                                          border: OutlineInputBorder(
                                              borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                          ),
                                          labelText: 'Username',
                                          prefixIcon: Icon(Icons.person_outline)
                                      ),
                                      validator: (val) => !val.contains('@') ? 'Insert a real email.' : null,
                                      textInputAction: TextInputAction.next,
                                      onFieldSubmitted: (String value) {
                                          _nameFocus.unfocus();
                                          FocusScope.of(context).requestFocus(_passFocus);
                                      },
                                  ),
                                ),
                                SizedBox(
                                    height: 20,
                                ),
                                FractionallySizedBox(
                                    widthFactor: 0.75,
                                    child: Stack(
                                      children: <Widget>[
                                        TextFormField(
                                            controller: _passController,
                                            focusNode: _passFocus,
                                            decoration: InputDecoration(
                                                border: OutlineInputBorder(
                                                    borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                ),
                                                labelText: 'Password',
                                                prefixIcon: Icon(Icons.lock_outline)
                                            ),
                                            validator: (val) => val.length < 6 ? 'Password most have a length of at least 6 characters.' : null,
                                            onFieldSubmitted: (String value) {
                                                _passFocus.unfocus();
                                            },
                                        ),
                                          Container(
                                              width: 500,
                                              height: 50,
                                          ),
                                      ],
                                    ),
                                ),
                                SizedBox(
                                    height: 20,
                                ),
                                FractionallySizedBox(
                                    widthFactor: 0.6,
                                  child: MaterialButton(
                                    onPressed: () {
                                        if (_formKey.currentState.validate()) {

                                        }
                                    },
                                    color: lightColor,
                                      height: 42,
                                    child: Text('LOG IN', style: titleWhiteButtonTextStyle,),
                                  ),
                                ),
                                MaterialButton(
                                    onPressed: (){

                                    },
                                    child: Text('Forgot password?',),
                                )
                            ],
                        ),
                      ),
                      Column(
                          children: <Widget>[
                              Text('Sign up as', style: greyLightTextStyle),
                              SizedBox(
                                  height: 10,
                              ),
                              FractionallySizedBox(
                                  widthFactor: 0.75,
                                child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: <Widget>[
                                        SignInButtonBuilder(
                                            backgroundColor: Color(0xFF3B5998),
                                            text: 'Transporter',
                                            icon: FontAwesomeIcons.truck,
                                            width: MediaQuery.of(context).size.width*0.35,
                                            onPressed: () {
                                                Navigator.pushReplacement(
                                                    context,
                                                    MaterialPageRoute(
                                                        builder: (context) => MenuTabsView()
                                                    ));
                                            },
                                        ),
                                        SignInButtonBuilder(
                                            backgroundColor: Color(0xFFC71610),
                                            text: 'Client',
                                            width: MediaQuery.of(context).size.width*0.35,
                                            icon: FontAwesomeIcons.truckLoading,
                                            onPressed: () {
                                              Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                      builder: (context) =>  RegisterView()
                                                  ));
                                            },
                                        ),
                                    ],
                                ),
                              ),
                          ],
                      ),
                    Container(),
                  ],
              ),
            ),
          ),
        ),
    );
  }

}
