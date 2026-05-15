import csv
import random
from pathlib import Path

path = Path(__file__).resolve().parent / 'dataset.csv'
rows = []
for i in range(320):
    blood_group = random.choices([0, 1, 2, 3], weights=[30, 30, 25, 15])[0]
    organ_type = random.choices([0, 1, 2], weights=[45, 35, 20])[0]
    donor_age = random.randint(18, 70)
    recipient_age = random.randint(5, 80)
    urgency = random.randint(1, 10)
    health_score = random.randint(40, 100)

    compatible = 0
    if health_score >= 70 and abs(donor_age - recipient_age) <= 20:
        if organ_type == 0 and blood_group in [0, 1, 2, 3]:
            compatible = 1
        elif organ_type == 1 and blood_group in [0, 1, 3]:
            compatible = 1
        elif organ_type == 2 and blood_group in [0, 2, 3]:
            compatible = 1

    if urgency >= 8 and health_score >= 60 and compatible == 1:
        compatible = 1

    if random.random() < 0.1:
        compatible = 1 - compatible

    rows.append([blood_group, organ_type, donor_age, recipient_age, urgency, health_score, compatible])

with path.open('w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['bloodGroup', 'organType', 'donorAge', 'recipientAge', 'urgency', 'healthScore', 'compatible'])
    writer.writerows(rows)

print(f'Wrote {len(rows)} rows to {path}')
