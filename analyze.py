import data
import matplotlib.pyplot as plt


def pos():
    x = [i[0] for i in data.record]
    y = [600 - i[1] for i in data.record]

    # plt.scatter(x=x, y=y, s=2)
    plt.plot(data.record, label=['x', 'y'])
    plt.legend()
    plt.show()


Ek = [i[0] for i in data.record]
Ep = [i[1] for i in data.record]
E = [i[0]+i[1] for i in data.record]
plt.plot(Ek, label='Ek')
plt.plot(Ep, label='Ep')
plt.plot(E, label='E')
plt.legend()
plt.show()
