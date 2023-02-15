import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:packet_truck_app/views/chat/conversationView.dart';
import 'package:packet_truck_app/views/menu/profile/profile.dart';
import 'package:packet_truck_app/views/menu/search/searchTripView.dart';

enum TabItem { trips, search, add, chat, profile }

class MenuTabsView extends StatefulWidget {

  @override
  _MenuTabsViewState createState() => _MenuTabsViewState();
}

class _MenuTabsViewState extends State<MenuTabsView> {

    int _selectedIndex;
    TabItem _currentItem;

    @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _selectedIndex = 0;
    _currentItem = TabItem.trips;
  }

  Widget body(){
      switch (_currentItem) {
          case TabItem.trips:
              return Center(child: Text('Trips'),);
          case TabItem.search:
              return SearchTripView();
          case TabItem.add:
              return Center(child: Text('Add'),);
          case TabItem.chat:
              return ConversationView();
          case TabItem.profile:
              return Profile();
          default:
              return Center(child: Text('Defaulr'),);
      }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: body(),
        bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            items: <BottomNavigationBarItem>[
                BottomNavigationBarItem(
                    icon: Icon(MdiIcons.truckFastOutline), title: Text("Trips")),
                BottomNavigationBarItem(
                    icon: Icon(MdiIcons.magnify), title: Text("Search")),
                BottomNavigationBarItem(
                    icon: Icon(MdiIcons.plusCircleOutline), title: Text("Add")),
                BottomNavigationBarItem(
                    icon: Icon(MdiIcons.chatOutline), title: Text("Chat")),
                BottomNavigationBarItem(
                    icon: Icon(MdiIcons.faceProfile), title: Text("Profile")),
            ],
            currentIndex: _selectedIndex,
            onTap: (int index) {
                TabItem selectedTabItem;

                switch (index) {
                    case 0:
                        selectedTabItem = TabItem.trips;
                        break;
                    case 1:
                        selectedTabItem = TabItem.search;
                        break;
                    case 2:
                        selectedTabItem = TabItem.add;
                        break;
                    case 3:
                        selectedTabItem = TabItem.chat;
                        break;
                    case 4:
                        selectedTabItem = TabItem.profile;
                        break;
                    default:
                        selectedTabItem = TabItem.trips;
                }
                setState(() {
                    _currentItem = selectedTabItem;
                    _selectedIndex = index;
                });
            },
            fixedColor: Colors.blue,
        ),
    );
  }
}
