import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/widgets/screenTextField.dart';

class RegisterView extends StatelessWidget {


    final GlobalKey _formKey = GlobalKey<FormState>();

    final FocusNode _nameFocus = FocusNode();
    final FocusNode _emailFocus = FocusNode();
    final FocusNode _phoneFocus = FocusNode();
    final FocusNode _passFocus = FocusNode();
    final FocusNode _repPassFocus = FocusNode();

    final TextEditingController _nameController = TextEditingController();
    final TextEditingController _emailController = TextEditingController();
    final TextEditingController _phoneController = TextEditingController();
    final TextEditingController _passController = TextEditingController();
    final TextEditingController _repPassController = TextEditingController();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
          child: ScreenTextField(
            child: Column(
                children: <Widget>[
                    Align(
                        alignment: Alignment.topLeft,
                      child: BackButton(
                          color: primaryColor,
                      ),
                    ),
                    Flexible(
                      child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          mainAxisSize: MainAxisSize.max,
                          children: <Widget>[
                              Column(
                                  children: <Widget>[
                                      Text("Let's Get Started!", style: titleBoldTextStyle,),
                                      SizedBox(
                                          height: 10,
                                      ),
                                      Text("Create an account to get all the great features!", style: greyLightTextStyle,),
                                  ],
                              ),
                              Column(
                                  children: <Widget>[
                                      FractionallySizedBox(
                                          widthFactor: 0.75,
                                        child: TextFormField(
                                            decoration: InputDecoration(
                                                border: OutlineInputBorder(
                                                    borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                ),
                                                labelText: 'Name and surname',
                                                prefixIcon: Icon(Icons.person_outline)
                                            ),
                                            focusNode: _nameFocus,
                                            controller: _nameController,
                                            textInputAction: TextInputAction.next,
                                            validator: (val) => val.length < 6 ? 'Enter a correct name and surname' : null,
                                            onFieldSubmitted: (String value) {
                                                _nameFocus.unfocus();
                                                FocusScope.of(context).requestFocus(_emailFocus);
                                            },
                                        ),
                                      ),
                                      SizedBox(
                                          height: 15,
                                      ),
                                      FractionallySizedBox(
                                          widthFactor: 0.75,
                                          child: TextFormField(
                                              decoration: InputDecoration(
                                                  border: OutlineInputBorder(
                                                      borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                  ),
                                                  labelText: 'Email',
                                                  prefixIcon: Icon(Icons.mail_outline)
                                              ),
                                              focusNode: _emailFocus,
                                              controller: _emailController,
                                              textInputAction: TextInputAction.next,
                                              validator: (val) => val.length < 6 ? 'Password most have a length of at least 6 characters.' : null,
                                              onFieldSubmitted: (String value) {
                                                  _emailFocus.unfocus();
                                                  FocusScope.of(context).requestFocus(_phoneFocus);
                                              },
                                          ),
                                      ),
                                      SizedBox(
                                          height: 15,
                                      ),
                                      FractionallySizedBox(
                                          widthFactor: 0.75,
                                          child: TextFormField(
                                              decoration: InputDecoration(
                                                  border: OutlineInputBorder(
                                                      borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                  ),
                                                  labelText: 'Phone',
                                                  prefixIcon: Icon(Icons.phone_iphone)
                                              ),
                                              controller: _phoneController,
                                              focusNode: _phoneFocus,
                                              textInputAction: TextInputAction.next,
                                              validator: (val) => val.length < 6 ? 'Password most have a length of at least 6 characters.' : null,
                                              onFieldSubmitted: (String value) {
                                                  _phoneFocus.unfocus();
                                                  FocusScope.of(context).requestFocus(_passFocus);
                                              },
                                          ),
                                      ),
                                      SizedBox(
                                          height: 15,
                                      ),
                                      FractionallySizedBox(
                                          widthFactor: 0.75,
                                          child: TextFormField(
                                              decoration: InputDecoration(
                                                  border: OutlineInputBorder(
                                                      borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                  ),
                                                  labelText: 'Password',
                                                  prefixIcon: Icon(Icons.lock_outline)
                                              ),
                                              textInputAction: TextInputAction.next,
                                              focusNode: _passFocus,
                                              controller: _passController,
                                              validator: (val) => val.length < 6 ? 'Password most have a length of at least 6 characters.' : null,
                                              onFieldSubmitted: (String value) {
                                                  _passFocus.unfocus();
                                                  FocusScope.of(context).requestFocus(_repPassFocus);
                                              },
                                          ),
                                      ),
                                      SizedBox(
                                          height: 15,
                                      ),
                                      FractionallySizedBox(
                                          widthFactor: 0.75,
                                          child: TextFormField(
                                              decoration: InputDecoration(
                                                  border: OutlineInputBorder(
                                                      borderRadius: const BorderRadius.all(const Radius.circular(30)),
                                                  ),
                                                  labelText: 'Confirm Password',
                                                  prefixIcon: Icon(Icons.lock_outline)
                                              ),
                                              controller: _repPassController,
                                              focusNode: _repPassFocus,
                                              validator: (val) => val.length < 6 ? 'Password most have a length of at least 6 characters.' : null,
                                              onFieldSubmitted: (String value) {
                                                  _repPassFocus.unfocus();
                                              },
                                          ),
                                      ),
                                  ],
                              ),
                              Column(
                                children: <Widget>[
                                  FractionallySizedBox(
                                      widthFactor: 0.6,
                                      child: MaterialButton(
                                          onPressed: () {
                                          },
                                          color: darkColor,
                                          height: 42,
                                          child: Text('CREATE', style: titleWhiteButtonTextStyle,),
                                      ),
                                  ),
                                    SizedBox(
                                        height: 25,
                                    )
                                ],
                              ),
                          ],
                      ),
                    ),
                ],
            ),
          ),
        ),
    );
  }
}
