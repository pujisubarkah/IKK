"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { withRoleGuard } from '@/lib/withRoleGuard';

interface Enumerator {
  id: string;
  name: string;
  nip: string;
  unit_kerja: string;
}

function EnumeratorPage() {
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const adminInstansiId = localStorage.getItem("id");
        if (!adminInstansiId) {
          throw new Error("Admin Instansi ID not found");
        }

        const response = await fetch(`/api/pengguna_enumerator?admin_instansi_id=${adminInstansiId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Data enumerators is not an array or empty");
        }

        const enumeratorList = data[0]?.enumerator || [];

        setEnumerators(enumeratorList);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setEnumerators([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/enumerator/ubah/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus enumerator ini?")) {
      // Di sini bisa ditambahkan logika hapusnya (API call delete)
      console.log(`Hapus enumerator dengan ID: ${id}`);
    }
  };

  if (isLoading) {
    return (
      <Sidebar>
        <div className="p-6">
          <p>Loading data enumerator...</p>
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <div className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Enumerator</h2>
          <Button
            onClick={() => router.push("/enumerator/tambah")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Tambah Enumerator
          </Button>
        </div>

        <div className="overflow-auto rounded-lg border mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Kerja</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NIP</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enumerators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                    Tidak ada data enumerator
                  </td>
                </tr>
              ) : (
                enumerators.map((enumerator, index) => (
                  <tr key={enumerator.id}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{enumerator.name}</td>
                    <td className="px-4 py-2">{enumerator.unit_kerja || '-'}</td>
                    <td className="px-4 py-2">{enumerator.nip}</td>
                    <td className="px-4 py-2 space-x-2">
                        <Button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                        onClick={() => handleEdit(enumerator.id)}
                      >
                        Ubah
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete(enumerator.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

const ProtectedPage = withRoleGuard(EnumeratorPage, [4]);
export default function Page() {
    return <ProtectedPage />
  }
