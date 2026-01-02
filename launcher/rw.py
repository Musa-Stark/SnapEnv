# if re.fullmatch(r"\d+", str(user_input)):
#         for idx, item in enumerate(data):
#             if idx == int(user_input) - 1:
#                 start_setup(item)
#     else:
#         target = user_input.lower().split(" ")
#         for item in data:
#             if len(target) == 1:
#                 if target == item["name"].lower().split():
#                     start_setup(item)
#                     break
#             else:
#                 target = "".join(target)
#                 # for i in target:
#                 #     if i in item["name"].lower().split():
#                 #         start_setup(item)
#                 #         break