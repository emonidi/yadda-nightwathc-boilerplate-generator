Feature: 100 Green Bottles

Scenario: Bottles should fall from the wall
   
   Given 100 green bottles are standing on the wall
   And those bottles are on the wall
   When 1 green bottles accidentally falls
   Then there are 99 green bottles standing on the wall


Scenario: Plastic bottles should not break

   Given 100 plastic bottles are standing on the wall
   And those bottles are green
   When 1 plastic bottles accidentally falls
   And another plascti bottle falls
   Then it does not break


Scenario: Should go get my car from the mall
   
   Given that I left my car in the mall
   And I did not drink yet
   When I go to the mall
   And get haircut
   Then I should take my car
   And get back home